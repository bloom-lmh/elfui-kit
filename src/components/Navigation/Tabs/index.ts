import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useComputed,
  useRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type {
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsFieldNames,
  TabsPosition,
  TabsTransition
} from "./types";

export type {
  TabsAlign,
  TabsBeforeLeave,
  TabsDensity,
  TabsDirection,
  TabsFieldNames,
  TabsItem,
  TabsPosition,
  TabsProps,
  TabsType,
  TabsTransition
} from "./types";

type TabsRawItem = Record<string, unknown>;

interface TabsViewItem {
  raw: TabsRawItem;
  label: string;
  value: string;
  icon: string;
  badge: string;
  disabled: boolean;
  closable: boolean;
  lazy: boolean;
  content: string;
}

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  defaultValue: { type: String, default: "" },
  alignTabs: { type: String, default: "start" },
  density: { type: String, default: "default" },
  direction: { type: String, default: "horizontal" },
  type: { type: String, default: "line" },
  closable: { type: Boolean, default: false },
  addable: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  tabPosition: { type: String, default: "" },
  stretch: { type: Boolean, default: false },
  beforeLeave: { type: Function, default: null },
  tabindex: { type: Number, default: 0 },
  color: { type: String, default: "" },
  grow: { type: Boolean, default: false },
  stacked: { type: Boolean, default: false },
  showPanels: { type: Boolean, default: false },
  hideSlider: { type: Boolean, default: false },
  transition: { type: String, default: "fade" },
  transitionDuration: { type: Number, default: 180 },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      value: "value",
      icon: "icon",
      disabled: "disabled",
      closable: "closable",
      lazy: "lazy",
      badge: "badge",
      content: "content"
    })
  }
});

const emit = defineEmits(["update:modelValue", "change", "tab-click", "tab-change", "tab-remove", "tab-add", "edit"]);

const active = useRef("");

const syncKey = useRef("");

const fieldNames = (): Required<TabsFieldNames> => {
  const o = (props.props || {}) as TabsFieldNames;
  return {
    label: o.label || "label",
    value: o.value || "value",
    icon: o.icon || "icon",
    disabled: o.disabled || "disabled",
    closable: o.closable || "closable",
    lazy: o.lazy || "lazy",
    badge: o.badge || "badge",
    content: o.content || "content"
  };
};

const items = (): TabsViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  return source.map((raw, index) => {
    const item = (raw || {}) as TabsRawItem;
    const value = String(item[fields.value] ?? index);
    return {
      raw: item,
      label: String(item[fields.label] ?? value),
      value,
      icon: String(item[fields.icon] ?? ""),
      badge: String(item[fields.badge] ?? ""),
      disabled: Boolean(item[fields.disabled]),
      closable: Boolean(item[fields.closable]),
      lazy: Boolean(item[fields.lazy]),
      content: String(item[fields.content] ?? "")
    };
  });
};

const firstEnabledValue = (): string => items().find((item) => !item.disabled)?.value ?? "";

watchEffect(() => {
  const next = String(props.modelValue || props.defaultValue || firstEnabledValue());
  const sig = `${props.modelValue || ""}::${props.defaultValue || ""}::${firstEnabledValue()}`;
  if (syncKey.peek() === sig) return;
  syncKey.set(sig);
  active.set(next);
});

const activeItem = (): TabsViewItem | undefined =>
  items().find((item) => item.value === active.value);

const isActive = (item: TabsViewItem): boolean => item.value === active.value;

const commitActive = (item: TabsViewItem): void => {
  active.set(item.value);
  emit("update:modelValue", item.value);
  emit("change", item.value, item.raw);
  emit("tab-change", item.value);
};

const runBeforeLeave = (
  item: TabsViewItem,
  oldValue: string,
  commit: () => void
): void => {
  const guard = props.beforeLeave as TabsBeforeLeave | null | undefined;
  if (typeof guard !== "function") {
    commit();
    return;
  }
  const result = guard(item.value, oldValue);
  if (result && typeof (result as Promise<boolean | void>).then === "function") {
    void (result as Promise<boolean | void>).then((allowed) => {
      if (allowed !== false) commit();
    });
    return;
  }
  if (result !== false) commit();
};

const select = (value: string): void => {
  const item = items().find((entry) => entry.value === String(value));
  if (!item || item.disabled || item.value === active.value) return;
  const oldValue = active.value;
  runBeforeLeave(item, oldValue, () => commitActive(item));
};

const onTabClick = (item: TabsViewItem, event?: Event): void => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  emit("tab-click", { name: item.value, item: item.raw, event });
  select(item.value);
};

const isClosable = (item: TabsViewItem): boolean =>
  (Boolean(props.closable) || Boolean(props.editable) || item.closable) && !item.disabled;

const nextAfterRemove = (item: TabsViewItem): string => {
  const list = items().filter((entry) => !entry.disabled && entry.value !== item.value);
  if (!list.length) return "";
  const currentIndex = items().findIndex((entry) => entry.value === item.value);
  return (list.find((entry) => items().findIndex((candidate) => candidate.value === entry.value) > currentIndex) || list[list.length - 1]!).value;
};

const remove = (value: string): void => {
  const item = items().find((entry) => entry.value === String(value));
  if (!item || !isClosable(item)) return;
  emit("tab-remove", item.value);
  emit("edit", item.value, "remove");
  if (item.value !== active.value) return;
  const next = nextAfterRemove(item);
  if (next) select(next);
};

const onRemoveClick = (item: TabsViewItem, event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  remove(item.value);
};

const add = (): void => {
  emit("tab-add");
  emit("edit", undefined, "add");
};

const setActive = (value: string): void => select(value);

const currentName = (): string => active.value;

const transition = (): TabsTransition => {
  const value = String(props.transition || "fade");
  return value === "slide" || value === "scale" || value === "none" || value === "custom"
    ? value
    : "fade";
};

const tabPosition = (): TabsPosition => {
  const value = String(props.tabPosition || "");
  if (value === "right" || value === "bottom" || value === "left" || value === "top") {
    return value;
  }
  return (props.direction as TabsDirection) === "vertical" ? "left" : "top";
};

const tabType = (): string => {
  const value = String(props.type || "line");
  return value === "card" || value === "border-card" ? value : "line";
};

const hostStyle = useComputed(() => {
  const color = String(props.color || "");
  const duration = Math.max(0, Number(props.transitionDuration || 180));
  return {
    ...(color ? { "--tabs-color": color } : {}),
    "--tabs-transition-duration": `${duration}ms`
  };
});

const rootClass = () => ({
  "is-vertical": tabPosition() === "left" || tabPosition() === "right",
  [`is-${tabPosition()}`]: true,
  [`is-${tabType()}`]: true,
  "is-grow": Boolean(props.grow),
  "is-stretch": Boolean(props.stretch),
  "is-stacked": Boolean(props.stacked),
  "is-closable": Boolean(props.closable) || Boolean(props.editable),
  "is-hide-slider": Boolean(props.hideSlider),
  "is-compact": (props.density as TabsDensity) === "compact",
  "is-comfortable": (props.density as TabsDensity) === "comfortable",
  "align-center": (props.alignTabs as TabsAlign) === "center",
  "align-end": (props.alignTabs as TabsAlign) === "end",
  "align-title": (props.alignTabs as TabsAlign) === "title",
  [`transition-${transition()}`]: true
});

defineExpose({ select, setActive, removeTab: remove, add, currentName });

defineStyle(styles);

const Tabs = defineHtml(html`
  <div :class=${["tabs", rootClass()]} :style=${hostStyle}>
    <div
      class="tab-list"
      role="tablist"
      :aria-orientation=${tabPosition() === "left" || tabPosition() === "right" ? "vertical" : "horizontal"}
    >
      <button
        v-for="item in items()"
        :key="item.value"
        type="button"
        role="tab"
        :class="['tab', { 'is-active': isActive(item), 'is-disabled': item.disabled }]"
        :disabled="item.disabled"
        :aria-selected="isActive(item) ? 'true' : 'false'"
        :tabindex=${props.tabindex}
        @click="onTabClick(item, $event)"
      >
        <span v-if="item.icon" class="tab-icon">{{ item.icon }}</span>
        <span class="tab-label">{{ item.label }}</span>
        <span v-if="item.badge" class="tab-badge">{{ item.badge }}</span>
        <span
          v-if="isClosable(item)"
          class="tab-close"
          role="button"
          tabindex="-1"
          aria-label="关闭标签"
          @click="onRemoveClick(item, $event)"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4.25 4.25 11.75 11.75M11.75 4.25 4.25 11.75"></path>
          </svg>
        </span>
        <span v-if="isActive(item)" class="tab-slider"></span>
      </button>
      <button
        v-if=${props.addable || props.editable}
        class="tab-add"
        type="button"
        aria-label="新增标签"
        @click=${add}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 3.25v9.5M3.25 8h9.5"></path>
        </svg>
      </button>
    </div>
    <div v-if=${props.showPanels} class="tab-panels">
      <section
        v-for="item in items()"
        v-show="isActive(item)"
        :key="item.value"
        :class="['tab-panel', { 'is-active': isActive(item) }]"
        role="tabpanel"
      >
        {{ item.content }}
      </section>
    </div>
  </div>
`);

export { Tabs };
