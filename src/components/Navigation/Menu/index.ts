// elf-menu — Material Design 3 导航菜单

import {
    defineEmits,
    defineExpose,
    defineProps,
    defineStyle,
    html,
    onMount,
    useComputed,
    useEventListener,
    useHost,
    useRef,
    useShadowRoot,
    watchEffect,
    defineHtml,
} from "elfui";

import baseStyles from "./style-base.scss?inline";
import modeStyles from "./style-mode.scss?inline";
import themeStyles from "./style-theme.scss?inline";
import type { MenuFieldNames, MenuMode, MenuTogglePlacement } from "./types";

export type { MenuFieldNames, MenuItem, MenuMode, MenuProps, MenuTogglePlacement } from "./types";

const SIGNATURE_SEP = "::elf-menu::";

type MenuRawItem = Record<string, unknown>;

interface MenuViewItem {
    raw: MenuRawItem;
    index: string;
    label: string;
    title: string;
    icon: string;
    disabled: boolean;
    badge: string;
    divider: boolean;
    group: boolean;
    route: unknown;
    popperClass: string;
    teleported: boolean;
    level: number;
    indexPath: string[];
    hasChildren: boolean;
    children: MenuViewItem[];
}

const props = defineProps({
    items: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
    defaultActive: { type: String, default: "" },
    defaultOpeneds: { type: Array, default: () => [] },
    mode: { type: String, default: "vertical" },
    theme: { type: String, default: "light" },
    collapse: { type: Boolean, default: false },
    ellipsis: { type: Boolean, default: false },
    ellipsisIcon: { type: String, default: "..." },
    popperOffset: { type: Number, default: 4 },
    menuTrigger: { type: String, default: "" },
    collapseTransition: { type: Boolean, default: true },
    popperEffect: { type: String, default: "light" },
    closeOnClickOutside: { type: Boolean, default: true },
    popperClass: { type: String, default: "" },
    popperStyle: { type: Object, default: () => ({}) },
    showTimeout: { type: Number, default: 0 },
    hideTimeout: { type: Number, default: 300 },
    persistent: { type: Boolean, default: true },
    uniqueOpened: { type: Boolean, default: false },
    router: { type: Boolean, default: false },
    props: {
        type: Object,
        default: () => ({
            index: "index",
            label: "label",
            title: "title",
            icon: "icon",
            disabled: "disabled",
            children: "children",
            badge: "badge",
            route: "route",
            popperClass: "popperClass",
            teleported: "teleported",
        }),
    },
    backgroundColor: { type: String, default: "" },
    textColor: { type: String, default: "" },
    activeTextColor: { type: String, default: "" },
    activeBackground: { type: String, default: "" },
    width: { type: String, default: "" },
    collapseWidth: { type: String, default: "64px" },
    indent: { type: Number, default: 20 },
    rounded: { type: Boolean, default: false },
    elevation: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
    showToggle: { type: Boolean, default: false },
    togglePlacement: { type: String, default: "header" },
    searchable: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: "搜索..." },
    trigger: { type: String, default: "click" },
});

const emit = defineEmits(["update:modelValue", "select", "open", "close", "collapse-change"]);

const host = useHost();

const shadow = useShadowRoot();

const activeKey = useRef("");

const openKeys = useRef<string[]>([]);

const activeSyncKey = useRef("");

const openSyncKey = useRef("");

const collapsed = useRef(Boolean(props.collapse));

const searchText = useRef("");

const fieldNames = (): Required<MenuFieldNames> => {
    const o = (props.props || {}) as MenuFieldNames;
    return {
        index: o.index || "index",
        label: o.label || "label",
        title: o.title || "title",
        icon: o.icon || "icon",
        disabled: o.disabled || "disabled",
        children: o.children || "children",
        badge: o.badge || "badge",
        divider: o.divider || "divider",
        group: o.group || "group",
        route: o.route || "route",
        popperClass: o.popperClass || "popperClass",
        teleported: o.teleported || "teleported",
    };
};

const isHorizontal = useComputed(() => (props.mode as MenuMode) === "horizontal");

const isCollapsed = useComputed(() => !isHorizontal.value && collapsed.value);

const _collapsed = () => isCollapsed.value;

const objectStyle = (value: unknown): Record<string, string> => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, string | number>).map(([key, item]) => [key, String(item)]),
    );
};

const menuTrigger = (): "click" | "hover" => {
    const value = String(props.menuTrigger || props.trigger || "click");
    return value === "hover" ? "hover" : "click";
};

watchEffect(() => {
    const next = Boolean(props.collapse);
    if (next !== collapsed.peek()) collapsed.set(next);
});

const toggleCollapse = () => {
    collapsed.set(!collapsed.peek());
    emit("collapse-change", collapsed.peek());
};

const togglePlacement = (): MenuTogglePlacement => (props.togglePlacement === "header" ? "header" : "footer");

const showHeaderToggle = (): boolean =>
    Boolean(props.showToggle && !isHorizontal.value && togglePlacement() === "header");

const showFooterToggle = (): boolean =>
    Boolean(props.showToggle && !isHorizontal.value && togglePlacement() !== "header");

const toggleTitle = (): string => (isCollapsed.value ? "展开菜单" : "折叠菜单");

const matchesSearch = (item: MenuViewItem): boolean => {
    const kw = searchText.value.toLowerCase();
    if (!kw) return true;
    return item.label.toLowerCase().includes(kw) || item.index.toLowerCase().includes(kw);
};

const onCustomToggleClick = (event: Event): void => {
    const isToggle = event
        .composedPath()
        .some((node) => node instanceof HTMLElement && node.getAttribute("slot") === "toggle");
    if (isToggle) toggleCollapse();
};

const onCustomSearchInput = (event: Event): void => {
    const input = event
        .composedPath()
        .find((node): node is HTMLInputElement => node instanceof HTMLInputElement);
    if (input) searchText.set(input.value);
};

useEventListener(host, "click", onCustomToggleClick);
useEventListener(host, "input", onCustomSearchInput);

onMount(() => {
    const onDocClick = (e: Event) => {
        if (!isHorizontal.value) return;
        if (!props.closeOnClickOutside) return;
        if (!host.contains(e.target as HTMLElement)) openKeys.set([]);
    };
    document.addEventListener("click", onDocClick, true);
});

const hostStyle = useComputed(() => {
    const s: Record<string, string> = {};
    if (!isHorizontal.value) {
        s["--m-w"] = _collapsed() ? "" : String(props.width || "260px");
    }
    const backgroundColor = String(props.backgroundColor || "");
    const textColor = String(props.textColor || "");
    const activeTextColor = String(props.activeTextColor || "");
    const activeBackground = String(props.activeBackground || "");

    s["--m-cw"] = String(props.collapseWidth || "64px");
    s["--m-popper-offset"] = `${Math.max(0, Number(props.popperOffset) || 0)}px`;
    if (backgroundColor) s["--m-bg"] = backgroundColor;
    if (textColor) s["--m-color"] = textColor;
    if (activeTextColor) s["--m-active-c"] = activeTextColor;
    if (activeBackground) s["--m-active-bg"] = activeBackground;
    if (props.rounded) s["--m-radius"] = "var(--elf-radius-md)";
    if (props.elevation) s["--m-shadow"] = "var(--elf-shadow-1)";
    return s;
});

watchEffect(() => {
    const sig = [props.modelValue ?? "", props.defaultActive ?? ""].map(String).join(SIGNATURE_SEP);
    if (activeSyncKey.peek() === sig) return;
    activeSyncKey.set(sig);
    activeKey.set(String(props.modelValue || props.defaultActive || ""));
});

watchEffect(() => {
    const defaults = !isHorizontal.value && Array.isArray(props.defaultOpeneds) ? props.defaultOpeneds : [];
    const next = defaults.map((k) => String(k));
    const sig = `${isHorizontal.value ? "horizontal" : "vertical"}${SIGNATURE_SEP}${next.join(SIGNATURE_SEP)}`;
    if (openSyncKey.peek() === sig) return;
    openSyncKey.set(sig);
    openKeys.set(next);
});

const normalizeItems = (rawItems: unknown, level = 0, ancestors: string[] = []): MenuViewItem[] => {
    if (!Array.isArray(rawItems)) return [];
    const fields = fieldNames();
    return rawItems.map((raw, fi) => {
        const item = (raw || {}) as MenuRawItem;
        const isDivider = Boolean(item[fields.divider]);
        const isGroup = Boolean(item[fields.group]) && !isDivider;
        if (isDivider)
            return {
                raw: item,
                index: `__divider_${level}_${fi}`,
                label: "",
                title: "",
                icon: "",
                disabled: false,
                badge: "",
                divider: true,
                group: false,
                route: undefined,
                popperClass: "",
                teleported: true,
                level,
                indexPath: ancestors,
                hasChildren: false,
                children: [],
            };
        if (isGroup) {
            const groupIndex = String(item[fields.index] ?? [...ancestors, `__group_${level}_${fi}`].join("/"));
            const groupLabel = String(item[fields.group] ?? "");
            const children = normalizeItems(item[fields.children], level + 1, [...ancestors, groupIndex]);
            return {
                raw: item,
                index: groupIndex,
                label: groupLabel,
                title: String(item[fields.title] ?? groupLabel),
                icon: String(item[fields.icon] ?? ""),
                disabled: false,
                badge: String(item[fields.badge] ?? ""),
                divider: false,
                group: true,
                route: item[fields.route],
                popperClass: String(item[fields.popperClass] ?? ""),
                teleported: item[fields.teleported] !== false,
                level,
                indexPath: ancestors,
                hasChildren: children.length > 0,
                children,
            };
        }
        const idx = String(item[fields.index] ?? [...ancestors, String(fi)].join("-"));
        const children = normalizeItems(item[fields.children], level + 1, [...ancestors, idx]);
        return {
            raw: item,
            index: idx,
            label: String(item[fields.label] ?? item[fields.title] ?? idx),
            title: String(item[fields.title] ?? item[fields.label] ?? idx),
            icon: String(item[fields.icon] ?? ""),
            disabled: Boolean(item[fields.disabled]),
            badge: String(item[fields.badge] ?? ""),
            divider: false,
            group: false,
            route: item[fields.route],
            popperClass: String(item[fields.popperClass] ?? ""),
            teleported: item[fields.teleported] !== false,
            level,
            indexPath: ancestors,
            hasChildren: children.length > 0,
            children,
        };
    });
};

const tree = (): MenuViewItem[] => normalizeItems(props.items);

const findItem = (index: string, items = tree()): MenuViewItem | undefined => {
    for (const item of items) {
        if (item.index === index) return item;
        const c = findItem(index, item.children);
        if (c) return c;
    }
    return undefined;
};

const isOpen = (index: string): boolean => openKeys.value.includes(index);

const isActive = (index: string): boolean => activeKey.value === index;

const getVisibleItems = (items = tree()): MenuViewItem[] => {
    const out: MenuViewItem[] = [];
    for (const item of items) {
        if (props.searchable && searchText.value && !matchesSearch(item) && !item.hasChildren) continue;
        out.push(item);
        if (!_collapsed() && item.hasChildren && (isOpen(item.index) || (props.searchable && searchText.value)))
            out.push(...getVisibleItems(item.children));
    }
    return out;
};

const flattenPanelItems = (items: MenuViewItem[]): MenuViewItem[] => {
    const out: MenuViewItem[] = [];
    for (const item of items) {
        out.push(item);
        if (item.hasChildren) out.push(...flattenPanelItems(item.children));
    }
    return out;
};

const activeHorizontalRoot = (): MenuViewItem | undefined => {
    const roots = tree();
    const opened = openKeys.value.find((k) => roots.some((r) => r.index === k));
    if (opened) return roots.find((r) => r.index === opened);
    return roots.find((r) => r.index === activeKey.value);
};

const getHorizontalPanelItems = (): MenuViewItem[] => {
    const root = activeHorizontalRoot();
    if (!root?.hasChildren || !isOpen(root.index)) return [];
    return flattenPanelItems(root.children);
};

const panelLeft = useRef("0px");

const popupTop = useRef("8px");

const nestedPopupTop = useRef("0px");

const alignPanel = (item: MenuViewItem) => {
    if (!isHorizontal.value) return;
    requestAnimationFrame(() => {
        const bar = shadow?.querySelector(".horizontal-bar");
        const btn = bar?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (btn) panelLeft.set(`${btn.offsetLeft}px`);
    });
};

const alignCollapsePopup = (item: MenuViewItem) => {
    if (!_collapsed()) return;
    requestAnimationFrame(() => {
        const menu = shadow?.querySelector(".menu") as HTMLElement | null;
        const btn = shadow?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (!menu || !btn) return;
        const menuRect = menu.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        popupTop.set(`${Math.max(8, btnRect.top - menuRect.top)}px`);
    });
};

const alignNestedPopup = (item: MenuViewItem) => {
    if (!_collapsed()) return;
    requestAnimationFrame(() => {
        const popup = shadow?.querySelector(".collapse-popup") as HTMLElement | null;
        const btn = popup?.querySelector(`[data-index="${item.index}"]`) as HTMLElement | null;
        if (!popup || !btn) return;
        const popupRect = popup.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        nestedPopupTop.set(`${Math.max(0, btnRect.top - popupRect.top)}px`);
    });
};

const emitOpen = (item: MenuViewItem) => emit("open", item.index, [...item.indexPath, item.index], item.raw);

const emitClose = (item: MenuViewItem) => emit("close", item.index, [...item.indexPath, item.index], item.raw);

const closeBranch = (item: MenuViewItem) => {
    const rm = new Set([item.index, ...flattenPanelItems(item.children).map((c) => c.index)]);
    openKeys.set(openKeys.value.filter((k) => !rm.has(k)));
    emitClose(item);
};

const openBranch = (item: MenuViewItem) => {
    if (props.uniqueOpened || isHorizontal.value) openKeys.set([...item.indexPath, item.index]);
    else if (!openKeys.value.includes(item.index)) openKeys.set([...openKeys.value, item.index]);
    emitOpen(item);
    alignPanel(item);
    // 展开后滚动到可见
    requestAnimationFrame(() => {
        const el = shadow?.querySelector(`[data-index="${item.index}"]`);
        if (el?.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
};

const toggleOpen = (item: MenuViewItem) => {
    if (isOpen(item.index)) closeBranch(item);
    else openBranch(item);
};

const routePath = (item: MenuViewItem): string => {
    const route = item.route;
    if (typeof route === "string") return route;
    if (route && typeof route === "object" && "path" in route) {
        return String((route as { path?: unknown }).path || "");
    }
    return item.index;
};

const navigate = (item: MenuViewItem) => {
    const target = routePath(item);
    if (props.router && typeof window !== "undefined" && target.startsWith("/")) window.location.hash = target;
};

const selectItem = (item: MenuViewItem) => {
    activeKey.set(item.index);
    emit("update:modelValue", item.index);
    emit("select", item.index, [...item.indexPath, item.index], item.raw);
    navigate(item);
};

const onItemClick = (item: MenuViewItem, e?: Event) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (item.disabled || item.divider || item.group) return;
    if (item.hasChildren) {
        if (_collapsed()) {
            selectItem(item);
            return;
        }
        toggleOpen(item);
        return;
    }
    if (isHorizontal.value) openKeys.set([]);
    selectItem(item);
};

const open = (index: string) => {
    const item = findItem(String(index));
    if (item?.hasChildren && !item.disabled) openBranch(item);
};

const close = (index: string) => {
    const item = findItem(String(index));
    if (item) closeBranch(item);
};

const select = (index: string) => {
    const item = findItem(String(index));
    if (item && !item.disabled && !item.hasChildren) selectItem(item);
};

const updateActiveIndex = (index: string): void => {
    activeKey.set(String(index || ""));
};

const handleResize = (): void => {
    const item = activeHorizontalRoot();
    if (item) alignPanel(item);
};

defineExpose({ open, close, select, handleResize, updateActiveIndex });

const hoveredIndex = useRef("");

const hoveredIndex2 = useRef("");

let hoverTimer: ReturnType<typeof setTimeout> | null = null;

const clearHoverTimer = () => {
    if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
};

const runAfter = (delay: unknown, callback: () => void): void => {
    const timeout = Math.max(0, Number(delay) || 0);
    if (timeout === 0) {
        callback();
        return;
    }
    hoverTimer = setTimeout(() => {
        hoverTimer = null;
        callback();
    }, timeout);
};

const onItemEnter = (item: MenuViewItem) => {
    if (item.divider || item.group) return;
    clearHoverTimer();
    if (_collapsed()) {
        clearHoverTimer();
        hoveredIndex.set(item.hasChildren ? item.index : "");
        hoveredIndex2.set("");
        if (item.hasChildren) alignCollapsePopup(item);
    } else if (menuTrigger() === "hover" && item.hasChildren) {
        // 关闭其他已展开的同级项，再展开当前
        runAfter(props.showTimeout, () => {
            const currentOpen = openKeys.peek();
            const path = [...item.indexPath, item.index];
            const siblingsOpen = currentOpen.filter((k) => !path.includes(k));
            if (siblingsOpen.length > 0) openKeys.set(path);
            if (!isOpen(item.index)) openBranch(item);
            hoveredIndex.set(item.index);
        });
    }
};

const onItemLeave = () => {
    clearHoverTimer();
    if (_collapsed()) {
        runAfter(props.hideTimeout, () => {
            hoveredIndex.set("");
            hoveredIndex2.set("");
        });
    } else if (menuTrigger() === "hover") {
        const idx = hoveredIndex.peek();
        runAfter(props.hideTimeout, () => {
            if (idx) {
                const item = findItem(idx);
                if (item && isOpen(idx)) closeBranch(item);
            }
            hoveredIndex.set("");
        });
    }
};

const onSubItemEnter = (item: MenuViewItem) => {
    clearHoverTimer();
    if (item.hasChildren) {
        hoveredIndex2.set(item.index);
        alignNestedPopup(item);
    }
};

const onSubItemLeave = () => {
    clearHoverTimer();
    runAfter(props.hideTimeout, () => {
        hoveredIndex2.set("");
    });
};

const getHoveredChildren = (): MenuViewItem[] => {
    const idx = hoveredIndex.value;
    if (!idx) return [];
    return findItem(idx)?.children ?? [];
};

const getHoveredChildren2 = (): MenuViewItem[] => {
    const idx = hoveredIndex2.value;
    if (!idx) return [];
    return findItem(idx)?.children ?? [];
};

const onPopupEnter = () => clearHoverTimer();

const onPopupLeave = () => {
    clearHoverTimer();
    runAfter(props.hideTimeout, () => {
        hoveredIndex.set("");
        hoveredIndex2.set("");
    });
};

const hasActiveChild = (item: MenuViewItem): boolean => {
    if (!item.hasChildren) return false;
    return item.children.some((c) => isActive(c.index) || hasActiveChild(c));
};

const itemClass = (item: MenuViewItem): Record<string, boolean> => ({
    "is-active": isActive(item.index) || (item.hasChildren && hasActiveChild(item)),
    "is-open": isOpen(item.index),
    "is-disabled": item.disabled,
    "has-children": item.hasChildren,
    "is-divider": item.divider,
    "is-group": item.group,
});

const itemStyle = (item: MenuViewItem): Record<string, string> => {
    if (isHorizontal.value || _collapsed() || item.divider || item.group) return {};
    return { paddingLeft: `${12 + item.level * (Number(props.indent) || 20)}px` };
};

const popperClass = (base: string, item?: MenuViewItem): unknown[] => [
    base,
    String(props.popperClass || ""),
    String(item?.popperClass || ""),
    `is-${String(props.popperEffect || "light")}`,
];

const popperStyle = (extra: Record<string, string> = {}): Record<string, string> => ({
    ...objectStyle(props.popperStyle),
    ...extra,
});

const horizontalPanelStyle = (): Record<string, string> => popperStyle({ left: panelLeft.value });

const collapsePopupStyle = (): Record<string, string> => popperStyle({ top: popupTop.value });

const nestedPopupStyle = (): Record<string, string> => popperStyle({ top: nestedPopupTop.value });

const nestedPopperClass = (): unknown[] => [
    ...popperClass("collapse-popup", findItem(hoveredIndex2.value)),
    "collapse-popup--nested",
];

const onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target?.classList.contains("menu-item")) return;
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        target.click();
        return;
    }
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    const root = target.getRootNode() as ParentNode;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".menu-item:not(.is-disabled):not(.is-divider)"));
    const idx = items.indexOf(target);
    if (idx < 0) return;
    e.preventDefault();
    items[(idx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
};

defineStyle(baseStyles);

defineStyle(modeStyles);

defineStyle(themeStyles);

const Menu = defineHtml(html`
    <nav
        :class=${[
            "menu",
            {
                "is-horizontal": isHorizontal,
                "is-collapsed": isCollapsed,
                "is-ellipsis": props.ellipsis,
                "is-bordered": props.bordered,
                "is-no-collapse-transition": !props.collapseTransition,
            },
        ]}
        :style=${hostStyle}
        role="navigation"
        @keydown=${onKeydown}
    >
        <div class="menu-header">
            <div class="menu-header-content"><slot name="header"></slot></div>
            <div v-if=${showHeaderToggle()} class="menu-toggle-slot menu-toggle-slot--header">
                <slot name="toggle">
                    <button class="collapse-toggle collapse-toggle--header" type="button" :title=${toggleTitle()} @click=${toggleCollapse}>
                        <span class="toggle-icon">${isCollapsed ? "›" : "‹"}</span>
                    </button>
                </slot>
            </div>
        </div>

        <div class="menu-search" v-if=${props.searchable && !isHorizontal && !isCollapsed} @input=${onCustomSearchInput}>
            <slot name="search">
                <input class="search-input" :placeholder=${props.searchPlaceholder || "搜索..."} />
            </slot>
        </div>

        <template v-if=${isHorizontal}>
            <div class="horizontal-wrap">
                <div class="horizontal-bar" role="menubar">
                    <button
                        v-for="item in tree()"
                        :key="item.index"
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :disabled="item.disabled || item.divider || item.group"
                        :title="item.label"
                        role="menuitem"
                        @click="onItemClick(item, $event)"
                        @mouseenter="onItemEnter(item)"
                        @mouseleave=${onItemLeave}
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren" class="menu-arrow">›</span>
                    </button>
                    <button v-if=${props.ellipsis} class="menu-ellipsis" type="button" aria-label="more">
                        ${props.ellipsisIcon || "..."}
                    </button>
                </div>
                <div
                    v-if=${getHorizontalPanelItems().length > 0}
                    :class=${popperClass("horizontal-panel", activeHorizontalRoot())}
                    role="menu"
                    :style=${horizontalPanelStyle()}
                >
                    <template v-for="item in getHorizontalPanelItems()" :key="item.index">
                        <hr v-if="item.divider" class="menu-divider" />
                        <strong v-else-if="item.group" class="menu-group-title">{{ item.label }}</strong>
                        <button
                            v-else
                            type="button"
                            :class="['menu-item', itemClass(item)]"
                            :disabled="item.disabled"
                            :title="item.label"
                            role="menuitem"
                            @click="onItemClick(item, $event)"
                        >
                            <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                            <span class="menu-label">{{ item.label }}</span>
                            <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                            <span v-if="item.hasChildren" class="menu-arrow">›</span>
                        </button>
                    </template>
                </div>
            </div>
            <slot name="footer"></slot>
        </template>

        <template v-else>
            <div class="menu-body">
                <template v-for="item in getVisibleItems()" :key="item.index">
                    <hr v-if="item.divider" class="menu-divider" />
                    <strong v-else-if="item.group" class="menu-group-title">{{ item.label }}</strong>
                    <button
                        v-else
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :style="itemStyle(item)"
                        :disabled="item.disabled"
                        :title="isCollapsed ? item.label : ''"
                        role="menuitem"
                        @click="onItemClick(item, $event)"
                        @mouseenter="onItemEnter(item)"
                        @mouseleave=${onItemLeave}
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren && !isCollapsed" class="menu-arrow">›</span>
                    </button>
                </template>
                <div v-if=${getVisibleItems().length === 0} class="menu-empty">暂无结果</div>

                <div
                    v-if=${isCollapsed && getHoveredChildren().length > 0}
                    :class=${popperClass("collapse-popup", findItem(hoveredIndex.value))}
                    role="menu"
                    :style=${collapsePopupStyle()}
                    @mouseenter=${onPopupEnter}
                    @mouseleave=${onPopupLeave}
                >
                    <button
                        v-for="item in getHoveredChildren()"
                        :key="item.index"
                        type="button"
                        :data-index="item.index"
                        :class="['menu-item', itemClass(item)]"
                        :disabled="item.disabled"
                        :title="item.label"
                        role="menuitem"
                        @click="onItemClick(item, $event)"
                        @mouseenter="onSubItemEnter(item)"
                        @mouseleave=${onSubItemLeave}
                    >
                        <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                        <span class="menu-label">{{ item.label }}</span>
                        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        <span v-if="item.hasChildren" class="menu-arrow">›</span>
                    </button>
                    <div
                        v-if=${getHoveredChildren2().length > 0}
                        :class=${nestedPopperClass()}
                        role="menu"
                        :style=${nestedPopupStyle()}
                    >
                        <button
                            v-for="item in getHoveredChildren2()"
                            :key="item.index"
                            type="button"
                            :data-index="item.index"
                            :class="['menu-item', itemClass(item)]"
                            :disabled="item.disabled"
                            :title="item.label"
                            role="menuitem"
                            @click="onItemClick(item, $event)"
                        >
                            <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
                            <span class="menu-label">{{ item.label }}</span>
                            <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="menu-footer">
                <slot name="footer"></slot>
                <div v-if=${showFooterToggle()} class="menu-toggle-slot">
                    <slot name="toggle">
                        <button class="collapse-toggle" type="button" :title=${toggleTitle()} @click=${toggleCollapse}>
                            <span class="toggle-icon">${isCollapsed ? "›" : "‹"}</span>
                        </button>
                    </slot>
                </div>
            </div>
        </template>
    </nav>
`);

export { Menu };
