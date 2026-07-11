import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useClickOutside,
  useEscapeKey,
  useEventListener,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type {
  DropdownCommandDetail,
  DropdownFieldNames,
  DropdownPlacement,
  DropdownTrigger
} from "./types";

export type {
  DropdownCommandDetail,
  DropdownFieldNames,
  DropdownItem,
  DropdownPlacement,
  DropdownProps,
  DropdownSize,
  DropdownTrigger
} from "./types";

const DROPDOWN_OPEN_EVENT = "elf-dropdown-open";

type RawItem = Record<string, unknown>;

interface ViewItem {
  raw: RawItem;
  label: string;
  command: string;
  icon: string;
  disabled: boolean;
  divided: boolean;
  shortcut: string;
  children: ViewItem[];
}

const props = defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: "下拉菜单" },
  trigger: { type: String, default: "click" },
  placement: { type: String, default: "bottom-start" },
  size: { type: String, default: "md" },
  type: { type: String, default: "default" },
  buttonProps: { type: Object, default: () => ({}) },
  effect: { type: String, default: "light" },
  triggerKeys: { type: Array, default: () => ["Enter", " ", "Space", "ArrowDown"] },
  virtualTriggering: { type: Boolean, default: false },
  virtualRef: { type: Object, default: null },
  showArrow: { type: Boolean, default: true },
  showTimeout: { type: Number, default: 120 },
  hideTimeout: { type: Number, default: 180 },
  role: { type: String, default: "menu" },
  tabindex: { type: Number, default: 0 },
  popperClass: { type: String, default: "" },
  popperStyle: { type: Object, default: () => ({}) },
  popperOptions: { type: Object, default: () => ({}) },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: "body" },
  persistent: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  hideOnClick: { type: Boolean, default: true },
  splitButton: { type: Boolean, default: false },
  maxHeight: { type: String, default: "280px" },
  props: {
    type: Object,
    default: () => ({
      label: "label",
      command: "command",
      icon: "icon",
      disabled: "disabled",
      divided: "divided",
      shortcut: "shortcut",
      children: "children"
    })
  }
});

const emit = defineEmits(["command", "visible-change", "click"]);

const open = useRef(false);

const selectedCommand = useRef("");

const selectedLabel = useRef("");

const host = useHost();

let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;
let hoverOpenTimer: ReturnType<typeof setTimeout> | null = null;

const fieldNames = (): Required<DropdownFieldNames> => {
  const o = (props.props || {}) as DropdownFieldNames;
  return {
    label: o.label || "label",
    command: o.command || "command",
    icon: o.icon || "icon",
    disabled: o.disabled || "disabled",
    divided: o.divided || "divided",
    shortcut: o.shortcut || "shortcut",
    children: o.children || "children"
  };
};

const normalize = (source: unknown[]): ViewItem[] => {
  const fields = fieldNames();
  return source.map((raw, index) => {
    const item = (raw || {}) as RawItem;
    const children = Array.isArray(item[fields.children])
      ? normalize(item[fields.children] as unknown[])
      : [];
    const label = String(item[fields.label] ?? item[fields.command] ?? index);
    return {
      raw: item,
      label,
      command: String(item[fields.command] ?? label),
      icon: String(item[fields.icon] ?? ""),
      disabled: Boolean(item[fields.disabled]),
      divided: Boolean(item[fields.divided]),
      shortcut: String(item[fields.shortcut] ?? ""),
      children
    };
  });
};

const items = (): ViewItem[] => normalize(Array.isArray(props.items) ? props.items : []);

const isDisabled = (): boolean => Boolean(props.disabled);

const triggerMode = (): DropdownTrigger => {
  const value = String(props.trigger || "click");
  return value === "hover" || value === "contextmenu" ? value : "click";
};

const placement = (): DropdownPlacement => {
  const value = String(props.placement || "bottom-start");
  return value === "bottom-end" || value === "top-start" || value === "top-end"
    ? value
    : "bottom-start";
};

const clearHoverCloseTimer = (): void => {
  if (!hoverCloseTimer) return;
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = null;
};

const clearHoverOpenTimer = (): void => {
  if (!hoverOpenTimer) return;
  clearTimeout(hoverOpenTimer);
  hoverOpenTimer = null;
};

const closeDropdown = (): void => {
  clearHoverOpenTimer();
  clearHoverCloseTimer();
  if (!open.peek()) return;
  open.set(false);
  emit("visible-change", false);
};

const setOpen = (next: boolean): void => {
  if (isDisabled() || open.peek() === next) return;
  if (next) {
    clearHoverCloseTimer();
    clearHoverOpenTimer();
  }
  if (next) document.dispatchEvent(new CustomEvent(DROPDOWN_OPEN_EVENT, { detail: host }));
  open.set(next);
  emit("visible-change", next);
};

const show = (): void => setOpen(true);

const hide = (): void => closeDropdown();

const toggle = (): void => {
  if (open.peek()) hide();
  else show();
};

const handleOpen = (): void => show();

const handleClose = (): void => hide();

const scheduleShow = (): void => {
  clearHoverOpenTimer();
  const delay = Math.max(0, Number(props.showTimeout) || 0);
  if (delay === 0) {
    show();
    return;
  }
  hoverOpenTimer = setTimeout(() => {
    hoverOpenTimer = null;
    show();
  }, delay);
};

const scheduleHide = (): void => {
  clearHoverCloseTimer();
  const delay = Math.max(0, Number(props.hideTimeout) || 0);
  if (delay === 0) {
    closeDropdown();
    return;
  }
  hoverCloseTimer = setTimeout(() => {
    hoverCloseTimer = null;
    closeDropdown();
  }, delay);
};

const onTriggerClick = (event: Event): void => {
  event.preventDefault();
  if (triggerMode() === "click") toggle();
};

const triggerKeys = (): string[] =>
  Array.isArray(props.triggerKeys) ? props.triggerKeys.map((key) => String(key)) : [];

const onTriggerKeydown = (event: KeyboardEvent): void => {
  if (!triggerKeys().includes(event.key)) return;
  event.preventDefault();
  show();
};

const onContextMenu = (event: Event): void => {
  if (triggerMode() !== "contextmenu") return;
  event.preventDefault();
  show();
};

const onMouseEnter = (): void => {
  if (triggerMode() !== "hover") return;
  clearHoverCloseTimer();
  scheduleShow();
};

const onMouseLeave = (): void => {
  if (triggerMode() !== "hover") return;
  clearHoverOpenTimer();
  scheduleHide();
};

const onMainClick = (event: Event): void => {
  event.preventDefault();
  if (isDisabled()) return;
  emit("click", event);
};

const onItemClick = (item: ViewItem, event?: Event): void => {
  event?.preventDefault();
  event?.stopPropagation();
  if (item.disabled || item.children.length > 0) return;
  selectedCommand.set(item.command);
  selectedLabel.set(item.label);
  const detail: DropdownCommandDetail = { command: item.command, item: item.raw };
  emit("command", detail);
  if (props.hideOnClick) closeDropdown();
};

const triggerLabel = (): string => selectedLabel.value || String(props.label || "");

const isSelected = (item: ViewItem): boolean =>
  Boolean(selectedCommand.value) && item.command === selectedCommand.value;

const objectStyle = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)])
  );
};

const buttonProps = (): Record<string, unknown> =>
  props.buttonProps && typeof props.buttonProps === "object"
    ? (props.buttonProps as Record<string, unknown>)
    : {};

const buttonType = (): string => {
  const value = String(props.type || "default");
  return ["primary", "success", "warning", "danger", "info"].includes(value) ? value : "default";
};

const buttonClass = (base: string): unknown[] => [
  base,
  `is-${buttonType()}`,
  String(buttonProps().class || "")
];

const buttonStyle = (): Record<string, string> => objectStyle(buttonProps().style);

const buttonDisabled = (): boolean => isDisabled() || Boolean(buttonProps().disabled);

const menuStyle = (): Record<string, string> => ({
  "--dropdown-max-height": String(props.maxHeight || "280px"),
  ...objectStyle(props.popperStyle)
});

const menuClass = (): unknown[] => [
  "menu",
  {
    "is-open": open.value,
    [`is-${placement()}`]: true,
    [`is-${String(props.effect || "light")}`]: true
  },
  String(props.popperClass || "")
];

const shouldRenderMenu = (): boolean => Boolean(props.persistent) || open.value;

useHostFlag("data-open", () => open.value);

useHostFlag("disabled", isDisabled);

useHostAttr("size", () => String(props.size || "md"));

useClickOutside(host, () => {
  if (props.closeOnClickOutside) hide();
});

useEscapeKey(hide);

useEventListener<CustomEvent<HTMLElement>>(document, DROPDOWN_OPEN_EVENT, (event) => {
  if (event.detail !== host) closeDropdown();
});

defineExpose({ show, hide, toggle, handleOpen, handleClose });

defineStyle(styles);

const Dropdown = defineHtml(html`
  <div class="dropdown" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave} @contextmenu=${onContextMenu}>
    <button v-if=${!props.splitButton} :class=${buttonClass("trigger")} :style=${buttonStyle()} part="trigger"
      type="button" :disabled=${buttonDisabled()} :aria-expanded=${open.value ? "true" : "false" } aria-haspopup="menu"
      :tabindex=${props.tabindex} @click=${onTriggerClick} @keydown=${onTriggerKeydown}>
      <slot name="trigger">
        <span class="label">${triggerLabel()}</span>
        <span class="arrow" v-if=${props.showArrow}>▼</span>
      </slot>
    </button>
    <template v-else>
      <button :class=${buttonClass("split-main")} :style=${buttonStyle()} part="main" type="button"
        :disabled=${buttonDisabled()} @click=${onMainClick}>
        <slot name="main">${triggerLabel()}</slot>
      </button>
      <button :class=${buttonClass("split-toggle")} part="trigger" type="button" :disabled=${buttonDisabled()}
        :aria-expanded=${open.value ? "true" : "false" } aria-haspopup="menu" :tabindex=${props.tabindex}
        @click=${onTriggerClick} @keydown=${onTriggerKeydown} aria-label="展开菜单">
        <span class="arrow" v-if=${props.showArrow}>▼</span>
      </button>
    </template>

    <div v-if=${shouldRenderMenu()} :class=${menuClass()} :style=${menuStyle()} part="menu" :role=${String(props.role
      || "menu" )}>
      <template v-for="item in items()" :key="item.command">
        <div v-if="item.children.length > 0" :class="['sub', { 'is-divided': item.divided }]">
          <button type="button" :class="['sub-trigger', { 'is-disabled': item.disabled }]" :disabled="item.disabled">
            <span class="icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span class="shortcut">{{ item.shortcut }}</span>
            <span>›</span>
          </button>
          <div class="sub-menu" role="menu">
            <button v-for="child in item.children" :key="child.command" type="button" :class="[
                    'item',
                    {
                      'is-disabled': child.disabled,
                      'is-divided': child.divided,
                      'is-selected': isSelected(child)
                    }
                  ]" :disabled="child.disabled" @click="onItemClick(child, $event)">
              <span class="icon">{{ child.icon }}</span>
              <span>{{ child.label }}</span>
              <span class="shortcut">{{ child.shortcut }}</span>
              <span></span>
            </button>
          </div>
        </div>
        <button v-else type="button" :class="[
                'item',
                {
                  'is-disabled': item.disabled,
                  'is-divided': item.divided,
                  'is-selected': isSelected(item)
                }
              ]" :disabled="item.disabled" @click="onItemClick(item, $event)">
          <span class="icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span class="shortcut">{{ item.shortcut }}</span>
          <span></span>
        </button>
      </template>
    </div>
  </div>
`);

export { Dropdown };
