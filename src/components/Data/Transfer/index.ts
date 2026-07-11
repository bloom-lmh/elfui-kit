// elf-transfer — 穿梭框
//
// 使用：
//   const selected = useRef([])
//   <elf-transfer :data="list" :modelValue="selected" @update:modelValue="onChange" />
//
// Material Design 风格，对标 Element Plus el-transfer。

import {
  defineEmits,
  defineProps,
  defineStyle,
  html,
  useReactive,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";

export type { TransferDataItem, TransferFieldNames, TransferProps } from "./types";

const props = defineProps({
  data: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
  titles: { type: Array, default: () => ["源列表", "目标列表"] },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: "请输入搜索内容" },
  props: { type: Object, default: () => ({ key: "key", label: "label" }) }
});

const emit = defineEmits(["update:modelValue"]);

type TransferViewItem = Record<string, unknown> & { __key: string; __label: string };

const fieldKey = useRef("key");

const fieldLabel = useRef("label");

const selectedKeys = useRef<string[]>([]);

const leftFilter = useRef("");

const rightFilter = useRef("");

const leftChecked = useReactive<Record<string, boolean>>({});

const rightChecked = useReactive<Record<string, boolean>>({});

const _source = useRef<TransferViewItem[]>([]);

const _target = useRef<TransferViewItem[]>([]);

const leftCheckedCount = useRef(0);

const rightCheckedCount = useRef(0);

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((key) => String(key));
};

const getCheckedKeys = (bucket: Record<string, boolean>): string[] =>
  Object.keys(bucket).filter((key) => bucket[key]);

const clearChecked = (bucket: Record<string, boolean>): void => {
  for (const key of Object.keys(bucket)) delete bucket[key];
};

const syncCheckedCount = (): void => {
  leftCheckedCount.set(getCheckedKeys(leftChecked).length);
  rightCheckedCount.set(getCheckedKeys(rightChecked).length);
};

const setChecked = (
  bucket: Record<string, boolean>,
  item: TransferViewItem,
  checked: boolean
): void => {
  if (checked) bucket[item.__key] = true;
  else delete bucket[item.__key];
  syncCheckedCount();
};

const commitValue = (next: string[]): void => {
  const normalized = Array.from(new Set(next.map((key) => String(key))));
  selectedKeys.set(normalized);
  emit("update:modelValue", normalized);
};

const getSource = () => _source.value;

const getTarget = () => _target.value;

const getLeftCount = () => _source.value.length;

const getRightCount = () => _target.value.length;

watchEffect(() => {
  const p = (props.props || { key: "key", label: "label" }) as Record<string, string>;
  fieldKey.set(p.key || "key");
  fieldLabel.set(p.label || "label");
});

watchEffect(() => {
  selectedKeys.set(normalizeKeys(props.modelValue));
});

watchEffect(() => {
  const all = (props.data || []) as Record<string, unknown>[];
  const selected = new Set(selectedKeys.value);
  const fk = fieldKey.value;
  const fl = fieldLabel.value;
  const leftKw = leftFilter.value.toLowerCase();
  const rightKw = rightFilter.value.toLowerCase();
  const left: TransferViewItem[] = [];
  const right: TransferViewItem[] = [];

  for (const item of all) {
    const key = String(item[fk] ?? "");
    const label = String(item[fl] ?? "");
    const viewItem = { ...item, __key: key, __label: label };
    if (selected.has(key)) {
      if (!rightKw || label.toLowerCase().includes(rightKw)) right.push(viewItem);
    } else if (!leftKw || label.toLowerCase().includes(leftKw)) {
      left.push(viewItem);
    }
  }

  _source.set(left);
  _target.set(right);

  const leftKeySet = new Set(left.map((item) => item.__key));
  const rightKeySet = new Set(right.map((item) => item.__key));
  for (const key of Object.keys(leftChecked)) {
    if (!leftKeySet.has(key)) delete leftChecked[key];
  }
  for (const key of Object.keys(rightChecked)) {
    if (!rightKeySet.has(key)) delete rightChecked[key];
  }
  syncCheckedCount();
});

const toggleLeftAll = (e: Event): void => {
  clearChecked(leftChecked);
  if ((e.target as HTMLInputElement).checked) {
    for (const item of _source.peek()) leftChecked[item.__key] = true;
  }
  syncCheckedCount();
};

const toggleRightAll = (e: Event): void => {
  clearChecked(rightChecked);
  if ((e.target as HTMLInputElement).checked) {
    for (const item of _target.peek()) rightChecked[item.__key] = true;
  }
  syncCheckedCount();
};

const toggleLeftItem = (item: TransferViewItem, e: Event): void => {
  setChecked(leftChecked, item, (e.target as HTMLInputElement).checked);
};

const toggleRightItem = (item: TransferViewItem, e: Event): void => {
  setChecked(rightChecked, item, (e.target as HTMLInputElement).checked);
};

const moveToRight = (): void => {
  const keys = getCheckedKeys(leftChecked);
  if (keys.length === 0) return;
  commitValue([...selectedKeys.peek(), ...keys]);
  clearChecked(leftChecked);
  syncCheckedCount();
};

const moveToLeft = (): void => {
  const keys = getCheckedKeys(rightChecked);
  if (keys.length === 0) return;
  const removed = new Set(keys);
  commitValue(selectedKeys.peek().filter((key) => !removed.has(key)));
  clearChecked(rightChecked);
  syncCheckedCount();
};

const onLeftFilterInput = (e: Event): void => {
  leftFilter.set((e.target as HTMLInputElement).value);
};

const onRightFilterInput = (e: Event): void => {
  rightFilter.set((e.target as HTMLInputElement).value);
};

defineStyle(styles);

const Transfer = defineHtml(html`
  <div class="panel panel-left">
    <div class="panel-header">
      <input
        type="checkbox"
        @change="toggleLeftAll($event)"
        :checked=${leftCheckedCount > 0 && leftCheckedCount === getLeftCount()}
      />
      <span>${props.titles ? props.titles[0] : "源列表"}</span>
      <span class="count">${leftCheckedCount}/${getLeftCount()}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input
        :placeholder=${props.filterPlaceholder || "请输入搜索内容"}
        @input=${onLeftFilterInput}
      />
    </div>
    <div class="panel-body">
      <div v-if=${getLeftCount() === 0} class="panel-empty">无数据</div>
      <label v-for="item in getSource()" :key="item.__key" class="panel-item">
        <input
          type="checkbox"
          :checked="leftChecked[item.__key] || false"
          @change.stop="toggleLeftItem(item, $event)"
        />
        <span>{{ item.__label }}</span>
      </label>
    </div>
  </div>

  <div class="buttons">
    <button @click=${moveToRight()} :disabled=${leftCheckedCount === 0} title="添加到右侧">
      →
    </button>
    <button @click=${moveToLeft()} :disabled=${rightCheckedCount === 0} title="移回左侧">←</button>
  </div>

  <div class="panel panel-right">
    <div class="panel-header">
      <input
        type="checkbox"
        @change="toggleRightAll($event)"
        :checked=${rightCheckedCount > 0 && rightCheckedCount === getRightCount()}
      />
      <span>${props.titles ? props.titles[1] : "目标列表"}</span>
      <span class="count">${rightCheckedCount}/${getRightCount()}</span>
    </div>
    <div class="panel-filter" v-if=${props.filterable}>
      <input
        :placeholder=${props.filterPlaceholder || "请输入搜索内容"}
        @input=${onRightFilterInput}
      />
    </div>
    <div class="panel-body">
      <div v-if=${getRightCount() === 0} class="panel-empty">无数据</div>
      <label v-for="item in getTarget()" :key="item.__key" class="panel-item">
        <input
          type="checkbox"
          :checked="rightChecked[item.__key] || false"
          @change.stop="toggleRightItem(item, $event)"
        />
        <span>{{ item.__label }}</span>
      </label>
    </div>
  </div>
`);

export { Transfer };
