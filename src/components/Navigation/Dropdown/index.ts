// elf-dropdown — 下拉菜单
//
// 支持 click / hover / contextmenu、分裂按钮、嵌套子菜单、键盘触发与基础无障碍。

import {
    defineEmits,
    defineExpose,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useClickOutside,
    useEffect,
    useEscapeKey,
    useEventListener,
    useHost,
    useHostAttr,
    useHostFlag,
    useRef,
} from "elfui";

import styles from "./style.scss?inline";
import type {
    DropdownButtonType,
    DropdownCommand,
    DropdownCommandDetail,
    DropdownEmits,
    DropdownFieldNames,
    DropdownItem,
    DropdownPlacement,
    DropdownProps,
    DropdownSize,
    DropdownSlots,
    DropdownTrigger,
    DropdownTriggerMode,
    DropdownVirtualRef,
} from "./types";

export type {
    DropdownButtonProps,
    DropdownButtonType,
    DropdownCommand,
    DropdownCommandDetail,
    DropdownEffect,
    DropdownElement,
    DropdownEmits,
    DropdownExpose,
    DropdownFieldNames,
    DropdownItem,
    DropdownItemProps,
    DropdownItemSlots,
    DropdownMenuProps,
    DropdownMenuSlots,
    DropdownPlacement,
    DropdownProps,
    DropdownSize,
    DropdownSlots,
    DropdownTrigger,
    DropdownTriggerMode,
    DropdownVirtualRef,
} from "./types";

const DROPDOWN_OPEN_EVENT = "elf-dropdown-open";

const DEFAULT_FIELDS: Required<DropdownFieldNames> = {
    label: "label",
    command: "command",
    icon: "icon",
    disabled: "disabled",
    divided: "divided",
    shortcut: "shortcut",
    children: "children",
};

const BUTTON_TYPES = new Set<DropdownButtonType>(["primary", "success", "warning", "danger", "info"]);

const DEFAULT_TRIGGER_KEYS = ["Enter", " ", "Space", "ArrowDown", "NumpadEnter"];
const TRIGGER_MODES = new Set<DropdownTriggerMode>(["click", "hover", "contextmenu"]);

type RawItem = Record<string, unknown>;

interface ViewItem {
    raw: RawItem;
    key: string;
    label: string;
    command: DropdownCommand;
    icon: string;
    disabled: boolean;
    divided: boolean;
    shortcut: string;
    children: ViewItem[];
}

// ─── pure helpers ───────────────────────────────────────────

const resolveFieldNames = (partial?: DropdownFieldNames | null): Required<DropdownFieldNames> => {
    const o = partial || {};
    return {
        label: o.label || DEFAULT_FIELDS.label,
        command: o.command || DEFAULT_FIELDS.command,
        icon: o.icon || DEFAULT_FIELDS.icon,
        disabled: o.disabled || DEFAULT_FIELDS.disabled,
        divided: o.divided || DEFAULT_FIELDS.divided,
        shortcut: o.shortcut || DEFAULT_FIELDS.shortcut,
        children: o.children || DEFAULT_FIELDS.children,
    };
};

const normalizeItems = (source: unknown[], fields: Required<DropdownFieldNames>, path = ""): ViewItem[] =>
    source.map((raw, index) => {
        const item = (raw || {}) as RawItem;
        const childSource = Array.isArray(item[fields.children]) ? (item[fields.children] as unknown[]) : [];
        const label = String(item[fields.label] ?? item[fields.command] ?? index);
        const command = (item[fields.command] ?? label) as DropdownCommand;
        const commandKey = typeof command === "object" ? index : String(command || index);
        const key = path ? `${path}/${commandKey}` : commandKey;
        return {
            raw: item,
            key,
            label,
            command,
            icon: String(item[fields.icon] ?? ""),
            disabled: Boolean(item[fields.disabled]),
            divided: Boolean(item[fields.divided]),
            shortcut: String(item[fields.shortcut] ?? ""),
            children: normalizeItems(childSource, fields, key),
        };
    });

const toStyleObject = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
    );
};

const resolveTriggers = (value: unknown): DropdownTriggerMode[] => {
    const source = Array.isArray(value) ? value : [value || "click"];
    const resolved = source
        .map((item) => String(item) as DropdownTriggerMode)
        .filter((item) => TRIGGER_MODES.has(item));
    return resolved.length > 0 ? Array.from(new Set(resolved)) : ["click"];
};

const resolvePlacement = (value: unknown): DropdownPlacement => {
    const next = String(value || "bottom-start");
    return next === "bottom" || next === "bottom-end" || next === "top" || next === "top-start" || next === "top-end"
        ? next
        : "bottom-start";
};

const resolveButtonType = (value: unknown): DropdownButtonType => {
    const next = String(value || "default") as DropdownButtonType;
    return BUTTON_TYPES.has(next) ? next : "default";
};

const resolveSize = (value: unknown): DropdownSize => {
    const next = String(value || "md");
    if (next === "small") return "sm";
    if (next === "large") return "lg";
    if (next === "default") return "md";
    return next === "sm" || next === "lg" ? next : "md";
};

const asStringList = (value: unknown, fallback: string[]): string[] =>
    Array.isArray(value) ? value.map((key) => String(key)) : fallback;

const positiveDelay = (value: unknown): number => Math.max(0, Number(value) || 0);

const cssSize = (value: unknown, fallback: string): string => {
    if (value == null || value === "") return fallback;
    return typeof value === "number" ? `${Math.max(0, value)}px` : String(value);
};

// ─── component setup ────────────────────────────────────────

const props = defineProps<DropdownProps>({
    items: { type: Array, default: () => [] },
    label: { type: String, default: "下拉菜单" },
    trigger: { type: [String, Array], default: "click" },
    placement: { type: String, default: "bottom-start" },
    size: { type: String, default: "md" },
    type: { type: String, default: "default" },
    buttonProps: { type: Object, default: () => ({}) },
    effect: { type: String, default: "light" },
    // default factory 会被编译器提升，只能写字面量，不能闭包模块常量
    triggerKeys: { type: Array, default: () => ["Enter", " ", "Space", "ArrowDown", "NumpadEnter"] },
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
    maxHeight: { type: [String, Number], default: "280px" },
    props: {
        type: Object,
        default: () => ({
            label: "label",
            command: "command",
            icon: "icon",
            disabled: "disabled",
            divided: "divided",
            shortcut: "shortcut",
            children: "children",
        }),
    },
});

const emit = defineEmits<DropdownEmits>();

const host = useHost();

const open = useRef(false);
const selectedCommand = useRef<DropdownCommand | null>(null);
const selectedLabel = useRef("");
const virtualStyle = useRef<Record<string, string>>({});

let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;
let hoverOpenTimer: ReturnType<typeof setTimeout> | null = null;
let cleanupVirtualTrigger = (): void => {};
let mounted = false;

// ─── derived ────────────────────────────────────────────────

const isDisabled = (): boolean => Boolean(props.disabled);

const triggerModes = (): DropdownTriggerMode[] => resolveTriggers(props.trigger);

const hasTrigger = (mode: DropdownTriggerMode): boolean => triggerModes().includes(mode);

const placement = (): DropdownPlacement => resolvePlacement(props.placement);

const size = (): DropdownSize => resolveSize(props.size);

const buttonType = (): DropdownButtonType => resolveButtonType(props.type);

const fieldNames = (): Required<DropdownFieldNames> => resolveFieldNames(props.props as DropdownFieldNames | undefined);

const viewItems = (): ViewItem[] => normalizeItems(Array.isArray(props.items) ? props.items : [], fieldNames());

const triggerKeys = (): string[] => asStringList(props.triggerKeys, DEFAULT_TRIGGER_KEYS);

const buttonPropsMap = (): Record<string, unknown> =>
    props.buttonProps && typeof props.buttonProps === "object" ? (props.buttonProps as Record<string, unknown>) : {};

const buttonDisabled = (): boolean => isDisabled() || Boolean(buttonPropsMap().disabled);

const buttonClass = (base: string): unknown[] => [base, `is-${buttonType()}`, String(buttonPropsMap().class || "")];

const buttonStyle = (): Record<string, string> => toStyleObject(buttonPropsMap().style);

const menuStyle = (): Record<string, string> => ({
    "--dropdown-max-height": cssSize(props.maxHeight, "280px"),
    ...toStyleObject(props.popperStyle),
    ...(props.virtualTriggering ? virtualStyle.value : {}),
});

const menuClass = (): unknown[] => [
    "menu",
    {
        "is-open": open.value,
        [`is-${placement()}`]: true,
        [`is-${String(props.effect || "light")}`]: true,
        "is-virtual": Boolean(props.virtualTriggering),
    },
    String(props.popperClass || ""),
];

const shouldRenderMenu = (): boolean => Boolean(props.persistent) || open.value;

const shouldRenderTrigger = (): boolean => !props.virtualTriggering;

const hasCompositionalMenu = (): boolean => Boolean(host.querySelector("elf-dropdown-menu"));

const menuRole = (): string => hasCompositionalMenu() ? "presentation" : String(props.role || "menu");

const triggerLabel = (): string => selectedLabel.value || String(props.label || "");

const isSelected = (item: ViewItem): boolean =>
    selectedCommand.value !== null && item.command === selectedCommand.value;

const virtualRef = (): DropdownVirtualRef | null => {
    const candidate = props.virtualRef as DropdownVirtualRef | null | undefined;
    return candidate && typeof candidate.getBoundingClientRect === "function" ? candidate : null;
};

// ─── open / close ───────────────────────────────────────────

const getMenuEl = (): HTMLElement | null => host.shadowRoot?.querySelector(".menu") ?? null;

const getFocusableItems = (): HTMLElement[] => {
    const menu = getMenuEl();
    if (!menu) return [];
    const dataItems = Array.from(menu.querySelectorAll<HTMLElement>(".item:not(:disabled), .sub-trigger:not(:disabled)"));
    const composedItems = Array.from(host.querySelectorAll<HTMLElement>("elf-dropdown-item:not([disabled])"))
        .map((item) => item.shadowRoot?.querySelector<HTMLElement>(".dropdown-item") ?? null)
        .filter((item): item is HTMLElement => Boolean(item));
    return [...dataItems, ...composedItems];
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

const clearHoverTimers = (): void => {
    clearHoverOpenTimer();
    clearHoverCloseTimer();
};

const updateVirtualPosition = (): void => {
    if (!props.virtualTriggering || typeof window === "undefined") {
        virtualStyle.set({});
        return;
    }
    const reference = virtualRef();
    if (!reference) return;
    const referenceRect = reference.getBoundingClientRect();
    const panelRect = getMenuEl()?.getBoundingClientRect();
    const panelWidth = panelRect?.width || 192;
    const panelHeight = panelRect?.height || 0;
    const gap = 6;
    const currentPlacement = placement();
    const isTop = currentPlacement.startsWith("top");
    const isEnd = currentPlacement.endsWith("end");
    const isCenter = currentPlacement === "top" || currentPlacement === "bottom";
    const rawLeft = isEnd
        ? referenceRect.right - panelWidth
        : isCenter
          ? referenceRect.left + (referenceRect.width - panelWidth) / 2
          : referenceRect.left;
    const rawTop = isTop
        ? referenceRect.top - panelHeight - gap
        : referenceRect.bottom + gap;
    virtualStyle.set({
        position: "fixed",
        left: `${Math.max(8, Math.min(rawLeft, window.innerWidth - panelWidth - 8))}px`,
        top: `${Math.max(8, rawTop)}px`,
        right: "auto",
        bottom: "auto",
    });
};

const focusFirstEnabledItem = (): void => {
    queueMicrotask(() => {
        updateVirtualPosition();
        getFocusableItems()[0]?.focus();
    });
};

const closeDropdown = (): void => {
    clearHoverTimers();
    if (!open.peek()) return;
    open.set(false);
    emit("visible-change", false);
};

const setOpen = (next: boolean): void => {
    if (isDisabled()) return;
    if (open.peek() === next) return;

    if (next) {
        clearHoverTimers();
        document.dispatchEvent(new CustomEvent(DROPDOWN_OPEN_EVENT, { detail: host }));
    }

    open.set(next);
    emit("visible-change", next);

    if (next) focusFirstEnabledItem();
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
    if (isDisabled()) return;
    clearHoverOpenTimer();
    const delay = positiveDelay(props.showTimeout);
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
    const delay = positiveDelay(props.hideTimeout);
    if (delay === 0) {
        closeDropdown();
        return;
    }
    hoverCloseTimer = setTimeout(() => {
        hoverCloseTimer = null;
        closeDropdown();
    }, delay);
};

// ─── handlers ───────────────────────────────────────────────

const onTriggerClick = (event: Event): void => {
    if (isDisabled()) return;
    if (!hasTrigger("click")) return;
    event.preventDefault();
    toggle();
};

const onTriggerKeydown = (event: KeyboardEvent): void => {
    if (isDisabled()) return;
    if (!triggerKeys().includes(event.key)) return;
    event.preventDefault();
    show();
};

const onContextMenu = (event: Event): void => {
    if (isDisabled() || !hasTrigger("contextmenu")) return;
    event.preventDefault();
    show();
};

const onMouseEnter = (): void => {
    if (isDisabled() || !hasTrigger("hover")) return;
    clearHoverCloseTimer();
    scheduleShow();
};

const onMouseLeave = (): void => {
    if (!hasTrigger("hover")) return;
    clearHoverOpenTimer();
    scheduleHide();
};

const onMainClick = (event: Event): void => {
    if (isDisabled()) return;
    event.preventDefault();
    event.stopPropagation();
    emit("click", event);
};

const onItemClick = (item: ViewItem, event?: Event): void => {
    event?.preventDefault();
    event?.stopPropagation();
    if (item.disabled || item.children.length > 0) return;

    selectedCommand.set(item.command);
    selectedLabel.set(item.label);

    const detail: DropdownCommandDetail = {
        command: item.command,
        item: item.raw as DropdownItem,
    };
    emit("command", detail);

    if (props.hideOnClick !== false) closeDropdown();
};

const onCompositionalCommand = (event: CustomEvent<{
    command: DropdownCommand;
    label: string;
    item: DropdownItem;
}>): void => {
    event.stopPropagation();
    if (isDisabled()) return;
    const detail = event.detail;
    selectedCommand.set(detail.command);
    selectedLabel.set(detail.label);
    emit("command", { command: detail.command, item: detail.item });
    if (props.hideOnClick !== false) closeDropdown();
};

const resolveFocusedIndex = (items: HTMLElement[]): number => {
    const root = host.shadowRoot;
    const current = (root?.activeElement as HTMLElement | null) || (document.activeElement as HTMLElement | null);
    if (!current) return -1;
    const direct = items.indexOf(current);
    if (direct >= 0) return direct;
    return items.findIndex((item) => item.contains(current));
};

const onMenuKeydown = (event: KeyboardEvent): void => {
    if (!open.peek()) return;

    const items = getFocusableItems();
    if (items.length === 0) return;

    const index = resolveFocusedIndex(items);

    if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = items[(index + 1 + items.length) % items.length];
        next?.focus();
        return;
    }

    if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = items[(index - 1 + items.length) % items.length];
        next?.focus();
        return;
    }

    if (event.key === "Home") {
        event.preventDefault();
        items[0]?.focus();
        return;
    }

    if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1]?.focus();
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
    }
};

const connectVirtualTrigger = (): void => {
    cleanupVirtualTrigger();
    if (!props.virtualTriggering || typeof window === "undefined") return;
    const target = virtualRef();
    const canListen = target && typeof target.addEventListener === "function" && typeof target.removeEventListener === "function";
    if (canListen) {
        target.addEventListener!("click", onTriggerClick as EventListener);
        target.addEventListener!("keydown", onTriggerKeydown as EventListener);
        target.addEventListener!("contextmenu", onContextMenu as EventListener);
        target.addEventListener!("mouseenter", onMouseEnter as EventListener);
        target.addEventListener!("mouseleave", onMouseLeave as EventListener);
    }
    window.addEventListener("resize", updateVirtualPosition, { passive: true });
    window.addEventListener("scroll", updateVirtualPosition, { passive: true, capture: true });
    cleanupVirtualTrigger = () => {
        if (canListen) {
            target.removeEventListener!("click", onTriggerClick as EventListener);
            target.removeEventListener!("keydown", onTriggerKeydown as EventListener);
            target.removeEventListener!("contextmenu", onContextMenu as EventListener);
            target.removeEventListener!("mouseenter", onMouseEnter as EventListener);
            target.removeEventListener!("mouseleave", onMouseLeave as EventListener);
        }
        window.removeEventListener("resize", updateVirtualPosition);
        window.removeEventListener("scroll", updateVirtualPosition, { capture: true });
    };
    updateVirtualPosition();
};

// ─── host bindings ──────────────────────────────────────────

useHostFlag("data-open", () => open.value);
useHostFlag("data-virtual-triggering", () => Boolean(props.virtualTriggering));
useHostFlag("disabled", isDisabled);
useHostAttr("size", size);
useHostAttr("type", buttonType);
useHostAttr("effect", () => String(props.effect || "light"));
useHostAttr("placement", placement);

useClickOutside(host, (event) => {
    const reference = virtualRef();
    if (props.virtualTriggering && reference && event.composedPath().includes(reference as EventTarget)) return;
    if (props.closeOnClickOutside !== false) hide();
});

useEscapeKey(() => {
    if (open.peek()) hide();
});

useEventListener<CustomEvent<HTMLElement>>(document, DROPDOWN_OPEN_EVENT, (event) => {
    if (event.detail !== host) closeDropdown();
});

useEventListener<CustomEvent<{
    command: DropdownCommand;
    label: string;
    item: DropdownItem;
}>>(host, "elf-dropdown-item-command", onCompositionalCommand);

useEffect(() => {
    void props.virtualTriggering;
    void props.virtualRef;
    void props.trigger;
    if (mounted) queueMicrotask(connectVirtualTrigger);
});

useEffect(() => {
    void props.placement;
    if (mounted && props.virtualTriggering) queueMicrotask(updateVirtualPosition);
});

onMount(() => {
    mounted = true;
    connectVirtualTrigger();
});

onUnmount(() => {
    mounted = false;
    clearHoverTimers();
    cleanupVirtualTrigger();
});

defineExpose({ show, hide, toggle, handleOpen, handleClose });
defineStyle(styles);

// ─── template ───────────────────────────────────────────────

const Dropdown = defineHtml<DropdownProps, DropdownEmits, DropdownSlots>(html`
    <div class="dropdown" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave} @contextmenu=${onContextMenu}>
        <button
            v-if=${shouldRenderTrigger() && !props.splitButton}
            :class=${buttonClass("trigger")}
            :style=${buttonStyle()}
            part="trigger"
            type="button"
            :disabled=${buttonDisabled()}
            :aria-expanded=${open.value ? "true" : "false"}
            aria-haspopup="menu"
            :tabindex=${props.tabindex}
            @click=${onTriggerClick}
            @keydown=${onTriggerKeydown}
        >
            <slot>
                <slot name="trigger">
                    <span class="label">${triggerLabel()}</span>
                    <span class="arrow" v-if=${props.showArrow} aria-hidden="true">▼</span>
                </slot>
            </slot>
        </button>

        <template v-if=${shouldRenderTrigger() && props.splitButton}>
            <button
                :class=${buttonClass("split-main")}
                :style=${buttonStyle()}
                part="main"
                type="button"
                :disabled=${buttonDisabled()}
                @click=${onMainClick}
            >
                <slot><slot name="main">${triggerLabel()}</slot></slot>
            </button>
            <button
                :class=${buttonClass("split-toggle")}
                part="trigger"
                type="button"
                :disabled=${buttonDisabled()}
                :aria-expanded=${open.value ? "true" : "false"}
                aria-haspopup="menu"
                :tabindex=${props.tabindex}
                @click=${onTriggerClick}
                @keydown=${onTriggerKeydown}
                aria-label="展开菜单"
            >
                <span class="arrow" v-if=${props.showArrow} aria-hidden="true">▼</span>
            </button>
        </template>

        <div
            v-if=${shouldRenderMenu()}
            :class=${menuClass()}
            :style=${menuStyle()}
            part="menu"
            :role=${menuRole()}
            @keydown=${onMenuKeydown}
        >
            <slot name="dropdown">
                <template v-for="item in viewItems()" :key="item.key">
                    <div v-if="item.children.length > 0" :class="['sub', { 'is-divided': item.divided }]">
                        <button
                            type="button"
                            class="sub-trigger"
                            :class="{ 'is-disabled': item.disabled }"
                            :disabled="item.disabled"
                            role="menuitem"
                            aria-haspopup="true"
                        >
                            <span class="icon" aria-hidden="true">{{ item.icon }}</span>
                            <span class="item-label">{{ item.label }}</span>
                            <span class="shortcut">{{ item.shortcut }}</span>
                            <span class="chevron" aria-hidden="true">›</span>
                        </button>
                        <div class="sub-menu" role="menu">
                            <button
                                v-for="child in item.children"
                                :key="child.key"
                                type="button"
                                class="item"
                                :class="{
                                  'is-disabled': child.disabled,
                                  'is-divided': child.divided,
                                  'is-selected': isSelected(child)
                                }"
                                :disabled="child.disabled"
                                role="menuitem"
                                @click="onItemClick(child, $event)"
                            >
                                <span class="icon" aria-hidden="true">{{ child.icon }}</span>
                                <span class="item-label">{{ child.label }}</span>
                                <span class="shortcut">{{ child.shortcut }}</span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                    <button
                        v-else
                        type="button"
                        class="item"
                        :class="{
                          'is-disabled': item.disabled,
                          'is-divided': item.divided,
                          'is-selected': isSelected(item)
                        }"
                        :disabled="item.disabled"
                        role="menuitem"
                        @click="onItemClick(item, $event)"
                    >
                        <span class="icon" aria-hidden="true">{{ item.icon }}</span>
                        <span class="item-label">{{ item.label }}</span>
                        <span class="shortcut">{{ item.shortcut }}</span>
                        <span></span>
                    </button>
                </template>
            </slot>
        </div>
    </div>
`);

export { Dropdown };
