import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  useReactive,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";

export type {
  TransferDataItem,
  TransferDirection,
  TransferFieldNames,
  TransferFormat,
  TransferProps,
  TransferTargetOrder
} from "./types";

const props = defineProps({
  data: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  titles: { type: Array, default: () => ["Source", "Target"] },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "Search" },
  filterMethod: { type: Function, default: undefined },
  targetOrder: { type: String, default: "original" },
  buttonTexts: { type: Array, default: () => [] },
  format: { type: Object, default: () => ({}) },
  leftDefaultChecked: { type: Array, default: () => [] },
  rightDefaultChecked: { type: Array, default: () => [] },
  props: { type: Object, default: () => ({ key: "key", label: "label", disabled: "disabled" }) }
});

const emit = defineEmits(["update:modelValue", "change", "left-check-change", "right-check-change"]);

type TransferViewItem = Record<string, unknown> & {
  __key: string;
  __label: string;
  __disabled: boolean;
  __original: number;
};

const fieldKey = useRef("key");
const fieldLabel = useRef("label");
const fieldDisabled = useRef("disabled");
const selectedKeys = useRef<string[]>([]);
const leftFilter = useRef("");
const rightFilter = useRef("");
const leftChecked = useReactive<Record<string, boolean>>({});
const rightChecked = useReactive<Record<string, boolean>>({});
const source = useRef<TransferViewItem[]>([]);
const target = useRef<TransferViewItem[]>([]);
const leftCheckedCount = useRef(0);
const rightCheckedCount = useRef(0);
const leftTotalCount = useRef(0);
const rightTotalCount = useRef(0);
let defaultsApplied = false;

const normalizeKeys = (value: unknown): string[] =>
  Array.isArray(value) ? Array.from(new Set(value.map((key) => String(key)))) : [];
const checkedKeys = (bucket: Record<string, boolean>): string[] => Object.keys(bucket).filter((key) => bucket[key]);
const clearChecked = (bucket: Record<string, boolean>): void => {
  for (const key of Object.keys(bucket)) delete bucket[key];
};
const syncCheckedCounts = (): void => {
  leftCheckedCount.set(checkedKeys(leftChecked).length);
  rightCheckedCount.set(checkedKeys(rightChecked).length);
};
const sourceItems = (): TransferViewItem[] => source.value;
const targetItems = (): TransferViewItem[] => target.value;
const leftSelectable = (): TransferViewItem[] => source.value.filter((item) => !item.__disabled);
const rightSelectable = (): TransferViewItem[] => target.value.filter((item) => !item.__disabled);
const leftAllChecked = (): boolean => {
  const items = leftSelectable();
  return items.length > 0 && items.every((item) => leftChecked[item.__key]);
};
const rightAllChecked = (): boolean => {
  const items = rightSelectable();
  return items.length > 0 && items.every((item) => rightChecked[item.__key]);
};

const commitValue = (next: string[], direction: TransferDirection, movedKeys: string[]): void => {
  const normalized = Array.from(new Set(next.map((key) => String(key))));
  selectedKeys.set(normalized);
  emit("update:modelValue", normalized);
  emit("change", normalized, direction, movedKeys);
};

const emitCheck = (side: "left" | "right", changedKeys: string[]): void => {
  const bucket = side === "left" ? leftChecked : rightChecked;
  emit(`${side}-check-change`, checkedKeys(bucket), changedKeys);
};

const matchesFilter = (query: string, item: TransferViewItem): boolean => {
  if (!query) return true;
  const method = props.filterMethod as unknown;
  if (typeof method === "function") return Boolean(method(query, item));
  return item.__label.toLowerCase().includes(query.toLowerCase());
};

const orderedTarget = (items: TransferViewItem[], keys: string[]): TransferViewItem[] => {
  if (props.targetOrder === "original") return items.filter((item) => keys.includes(item.__key));
  const byKey = new Map(items.map((item) => [item.__key, item]));
  return keys.map((key) => byKey.get(key)).filter((item): item is TransferViewItem => Boolean(item));
};

watchEffect(() => {
  const fieldMap = (props.props || {}) as Record<string, string>;
  fieldKey.set(fieldMap.key || "key");
  fieldLabel.set(fieldMap.label || "label");
  fieldDisabled.set(fieldMap.disabled || "disabled");
});

watchEffect(() => selectedKeys.set(normalizeKeys(props.modelValue)));

const rebuild = (): void => {
  const all = (props.data || []) as Record<string, unknown>[];
  const selected = new Set(selectedKeys.value);
  const entries = all.map((item, index) => ({
    ...item,
    __key: String(item[fieldKey.value] ?? ""),
    __label: String(item[fieldLabel.value] ?? ""),
    __disabled: Boolean(item[fieldDisabled.value]),
    __original: index
  })) as TransferViewItem[];
  const selectedEntries = orderedTarget(entries, selectedKeys.value);
  const sourceEntries = entries.filter((item) => !selected.has(item.__key));
  const nextSource = sourceEntries.filter((item) => matchesFilter(leftFilter.value, item));
  const nextTarget = selectedEntries.filter((item) => matchesFilter(rightFilter.value, item));
  source.set(nextSource);
  target.set(nextTarget);
  leftTotalCount.set(sourceEntries.length);
  rightTotalCount.set(selectedEntries.length);

  const visibleLeft = new Set(nextSource.map((item) => item.__key));
  const visibleRight = new Set(nextTarget.map((item) => item.__key));
  for (const key of Object.keys(leftChecked)) if (!visibleLeft.has(key)) delete leftChecked[key];
  for (const key of Object.keys(rightChecked)) if (!visibleRight.has(key)) delete rightChecked[key];
  syncCheckedCounts();

  if (!defaultsApplied && entries.length > 0) {
    const leftDefaults = new Set(normalizeKeys(props.leftDefaultChecked));
    const rightDefaults = new Set(normalizeKeys(props.rightDefaultChecked));
    for (const item of sourceEntries) if (!item.__disabled && leftDefaults.has(item.__key)) leftChecked[item.__key] = true;
    for (const item of selectedEntries) if (!item.__disabled && rightDefaults.has(item.__key)) rightChecked[item.__key] = true;
    defaultsApplied = true;
    syncCheckedCounts();
  }
};
watchEffect(rebuild);
onMount(rebuild);

const setChecked = (side: "left" | "right", item: TransferViewItem, checked: boolean): void => {
  if (item.__disabled) return;
  const bucket = side === "left" ? leftChecked : rightChecked;
  if (checked) bucket[item.__key] = true;
  else delete bucket[item.__key];
  syncCheckedCounts();
  emitCheck(side, [item.__key]);
};

const toggleAll = (side: "left" | "right", event: Event): void => {
  const bucket = side === "left" ? leftChecked : rightChecked;
  const items = side === "left" ? leftSelectable() : rightSelectable();
  clearChecked(bucket);
  if ((event.target as HTMLInputElement).checked) {
    for (const item of items) bucket[item.__key] = true;
  }
  syncCheckedCounts();
  emitCheck(side, items.map((item) => item.__key));
};

const moveToRight = (): void => {
  const keys = checkedKeys(leftChecked);
  if (keys.length === 0) return;
  const existing = selectedKeys.peek();
  const next = props.targetOrder === "unshift" ? [...keys, ...existing] : [...existing, ...keys];
  commitValue(next, "right", keys);
  clearChecked(leftChecked);
  syncCheckedCounts();
};

const moveToLeft = (): void => {
  const keys = checkedKeys(rightChecked);
  if (keys.length === 0) return;
  const removed = new Set(keys);
  commitValue(selectedKeys.peek().filter((key) => !removed.has(key)), "left", keys);
  clearChecked(rightChecked);
  syncCheckedCounts();
};

const onFilterInput = (side: "left" | "right", event: Event): void => {
  const value = (event.target as HTMLInputElement).value;
  if (side === "left") leftFilter.set(value);
  else rightFilter.set(value);
};
const clearQuery = (side?: "left" | "right"): void => {
  if (!side || side === "left") leftFilter.set("");
  if (!side || side === "right") rightFilter.set("");
};
const title = (side: "left" | "right"): string => String((props.titles as string[])[side === "left" ? 0 : 1] || (side === "left" ? "Source" : "Target"));
const buttonText = (direction: "left" | "right"): string => {
  const texts = props.buttonTexts as string[];
  return String(texts?.[direction === "left" ? 0 : 1] || (direction === "left" ? "←" : "→"));
};
const countText = (side: "left" | "right"): string => {
  const checked = side === "left" ? leftCheckedCount.value : rightCheckedCount.value;
  const total = side === "left" ? leftTotalCount.value : rightTotalCount.value;
  const format = (props.format || {}) as Record<string, string>;
  const template = checked > 0 ? format.hasChecked || "${checked}/${total}" : format.noChecked || "${total}";
  return template.replace(/\$\{checked\}/g, String(checked)).replace(/\$\{total\}/g, String(total));
};

defineExpose({
  clearQuery,
  leftPanel: { get query() { return leftFilter.peek(); } },
  rightPanel: { get query() { return rightFilter.peek(); } }
});
defineStyle(styles);

const Transfer = defineHtml(html`
  <section class="panel panel-left" aria-label="Source transfer panel">
    <div class="panel-header">
      <input type="checkbox" :checked=${leftAllChecked()} @change="toggleAll('left', $event)" aria-label="Select all source items" />
      <span>${title("left")}</span>
      <span class="count">${countText("left")}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input :value=${leftFilter.value} :placeholder=${props.filterPlaceholder} aria-label="Filter source items" @input="onFilterInput('left', $event)" />
    </div>
    <div class="panel-body" role="list">
      <div v-if=${sourceItems().length === 0} class="panel-empty"><slot name="left-empty">No data</slot></div>
      <label v-for="item in sourceItems()" :key="item.__key" class="panel-item" :class="{ 'is-disabled': item.__disabled }">
        <input type="checkbox" :checked="leftChecked[item.__key] || false" :disabled="item.__disabled" @change="setChecked('left', item, $event.target.checked)" />
        <span>{{ item.__label }}</span>
      </label>
    </div>
    <footer class="panel-footer"><slot name="left-footer"></slot></footer>
  </section>

  <div class="buttons" aria-label="Transfer actions">
    <button type="button" @click=${moveToRight} :disabled=${leftCheckedCount.value === 0} aria-label="Move selected to target">${buttonText("right")}</button>
    <button type="button" @click=${moveToLeft} :disabled=${rightCheckedCount.value === 0} aria-label="Move selected to source">${buttonText("left")}</button>
  </div>

  <section class="panel panel-right" aria-label="Target transfer panel">
    <div class="panel-header">
      <input type="checkbox" :checked=${rightAllChecked()} @change="toggleAll('right', $event)" aria-label="Select all target items" />
      <span>${title("right")}</span>
      <span class="count">${countText("right")}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input :value=${rightFilter.value} :placeholder=${props.filterPlaceholder} aria-label="Filter target items" @input="onFilterInput('right', $event)" />
    </div>
    <div class="panel-body" role="list">
      <div v-if=${targetItems().length === 0} class="panel-empty"><slot name="right-empty">No data</slot></div>
      <label v-for="item in targetItems()" :key="item.__key" class="panel-item" :class="{ 'is-disabled': item.__disabled }">
        <input type="checkbox" :checked="rightChecked[item.__key] || false" :disabled="item.__disabled" @change="setChecked('right', item, $event.target.checked)" />
        <span>{{ item.__label }}</span>
      </label>
    </div>
    <footer class="panel-footer"><slot name="right-footer"></slot></footer>
  </section>
`);

export { Transfer };
