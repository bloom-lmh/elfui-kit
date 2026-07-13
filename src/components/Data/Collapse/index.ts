import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useRef,
  watchEffect
} from "elfui";

import styles from "./style.scss?inline";
import type { CollapseFieldNames, CollapseItem, CollapseModelValue, CollapseProps } from "./types";

export type { CollapseFieldNames, CollapseItem, CollapseModelValue, CollapseProps } from "./types";

interface ViewItem {
  raw: Record<string, unknown>;
  name: string;
  title: string;
  content: string;
  disabled: boolean;
}

const props = defineProps<CollapseProps>({
  modelValue: { type: null, default: "" },
  accordion: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  props: {
    type: Object,
    default: () => ({ name: "name", title: "title", content: "content", disabled: "disabled" })
  }
});

const emit = defineEmits(["update:modelValue", "change"]);
const active = useRef<string[]>([]);

const nextId = (): string => {
  const store = globalThis as typeof globalThis & { __elfCollapseIdSeed?: number };
  store.__elfCollapseIdSeed = (store.__elfCollapseIdSeed ?? 0) + 1;
  return `elf-collapse-${store.__elfCollapseIdSeed}`;
};

const id = nextId();

const fieldNames = (): Required<CollapseFieldNames> => {
  const value = props.props || {};
  return {
    name: value.name || "name",
    title: value.title || "title",
    content: value.content || "content",
    disabled: value.disabled || "disabled"
  };
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item));
  return value === null || value === undefined || value === "" ? [] : [String(value)];
};

watchEffect(() => {
  active.set(toArray(props.modelValue));
});

const viewItems = (): ViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  return source.map((entry, index) => {
    const raw = (entry || {}) as Record<string, unknown>;
    const name = String(raw[fields.name] ?? index);
    return {
      raw,
      name,
      title: String(raw[fields.title] ?? name),
      content: String(raw[fields.content] ?? ""),
      disabled: Boolean(raw[fields.disabled])
    };
  });
};

const isActive = (item: ViewItem): boolean => active.value.includes(item.name);

const panelId = (item: ViewItem): string => `${id}-panel-${encodeURIComponent(item.name)}`;
const headerId = (item: ViewItem): string => `${id}-header-${encodeURIComponent(item.name)}`;

const outputValue = (next: string[]): CollapseModelValue =>
  props.accordion ? next[0] || "" : next;

const toggle = (item: ViewItem): void => {
  if (item.disabled) return;
  const current = active.value;
  const opened = current.includes(item.name);
  const next = props.accordion
    ? opened
      ? []
      : [item.name]
    : opened
      ? current.filter((name) => name !== item.name)
      : [...current, item.name];
  active.set(next);
  const detail = outputValue(next);
  emit("update:modelValue", detail);
  emit("change", detail);
};

const onHeaderClick = (event: Event): void => {
  const name = (event.currentTarget as HTMLElement | null)?.dataset.name;
  const item = viewItems().find((entry) => entry.name === name);
  if (item) toggle(item);
};

defineStyle(styles);

const Collapse = defineHtml<CollapseProps>(html`
  <div class="collapse" part="collapse">
    <div
      v-for="item in viewItems()"
      :key="item.name"
      :class="['item', { 'is-active': isActive(item), 'is-disabled': item.disabled }]"
      part="item"
    >
      <button
        class="header"
        type="button"
        :data-name="item.name"
        :id="headerId(item)"
        :disabled="item.disabled"
        :aria-expanded="isActive(item) ? 'true' : 'false'"
        :aria-controls="panelId(item)"
        @click=${onHeaderClick}
      >
        <span>{{ item.title }}</span>
        <span class="arrow" aria-hidden="true">›</span>
      </button>
      <div
        class="body"
        part="body"
        :id="panelId(item)"
        role="region"
        :aria-labelledby="headerId(item)"
      >
        {{ item.content }}
        <slot></slot>
      </div>
    </div>
  </div>
`);

export { Collapse };
