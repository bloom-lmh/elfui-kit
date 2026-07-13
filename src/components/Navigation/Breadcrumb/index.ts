import { defineEmits, defineProps, defineStyle, html, onBeforeUnmount, onMount, useRef, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { BreadcrumbFieldNames, BreadcrumbRouteLocation } from "./types";

export type { BreadcrumbFieldNames, BreadcrumbItem, BreadcrumbProps, BreadcrumbRouteLocation } from "./types";

type BreadcrumbRawItem = Record<string, unknown>;

interface BreadcrumbViewItem {
    raw: BreadcrumbRawItem;
    key: string;
    label: string;
    to: string;
    replace: boolean;
    disabled: boolean;
    current: boolean;
    ellipsis: boolean;
    last: boolean;
}

const props = defineProps({
    items: { type: Array, default: () => [] },
    separator: { type: String, default: "/" },
    separatorIcon: { type: String, default: "" },
    router: { type: Boolean, default: false },
    currentPath: { type: String, default: "" },
    maxItems: { type: Number, default: 0 },
    props: {
        type: Object,
        default: () => ({
            label: "label",
            to: "to",
            disabled: "disabled",
            replace: "replace",
        }),
    },
});

const emit = defineEmits(["click", "update:currentPath"]);

const hashPath = useRef("");

const innerPath = useRef("");

let cleanupHash: (() => void) | null = null;

const readHash = (): string => {
    if (typeof window === "undefined") return "";
    return window.location.hash ? window.location.hash.slice(1) || "/" : "";
};

onMount(() => {
    hashPath.set(readHash());
    const onHashChange = (): void => {
        hashPath.set(readHash());
    };
    window.addEventListener("hashchange", onHashChange);
    cleanupHash = () => window.removeEventListener("hashchange", onHashChange);
});

onBeforeUnmount(() => {
    cleanupHash?.();
    cleanupHash = null;
});

const fieldNames = (): Required<BreadcrumbFieldNames> => {
    const o = (props.props || {}) as BreadcrumbFieldNames;
    return {
        label: o.label || "label",
        to: o.to || "to",
        disabled: o.disabled || "disabled",
        replace: o.replace || "replace",
    };
};

const activePath = (): string => String(props.currentPath || (props.router ? hashPath.value : innerPath.value));

const normalizeTo = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value !== "object") return String(value);
    const route = value as BreadcrumbRouteLocation;
    const target = route.path || route.hash || route.name || "";
    return String(target).replace(/^#/, "") || "";
};

const markLast = (items: BreadcrumbViewItem[]): BreadcrumbViewItem[] =>
    items.map((item, index) => ({
        ...item,
        last: index === items.length - 1,
    }));

const normalizeItems = (): BreadcrumbViewItem[] => {
    const fields = fieldNames();
    const rawItems = Array.isArray(props.items) ? props.items : [];
    const currentPath = activePath();
    return rawItems.map((raw, index) => {
        const item = (raw || {}) as BreadcrumbRawItem;
        const to = normalizeTo(item[fields.to]);
        const label = String(item[fields.label] ?? (to || index + 1));
        return {
            raw: item,
            key: to || `${label}-${index}`,
            label,
            to,
            replace: Boolean(item[fields.replace]),
            disabled: Boolean(item[fields.disabled]),
            current: currentPath ? to === currentPath : index === rawItems.length - 1,
            ellipsis: false,
            last: false,
        };
    });
};

const visibleItems = (): BreadcrumbViewItem[] => {
    const source = normalizeItems();
    const maxItems = Math.max(0, Math.trunc(Number(props.maxItems) || 0));
    if (maxItems <= 0 || source.length <= maxItems) return markLast(source);

    const limit = Math.max(3, maxItems);
    const tailCount = Math.max(1, limit - 2);
    return markLast([
        source[0]!,
        {
            raw: {},
            key: "__ellipsis",
            label: "...",
            to: "",
            replace: false,
            disabled: true,
            current: false,
            ellipsis: true,
            last: false,
        },
        ...source.slice(-tailCount),
    ]);
};

const onItemClick = (item: BreadcrumbViewItem, event?: Event): void => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (item.disabled || item.current || item.ellipsis) return;
    innerPath.set(item.to);
    emit("click", item.raw, item.to);
    emit("update:currentPath", item.to);
    if (props.router && item.to && typeof window !== "undefined") {
        hashPath.set(item.to);
        if (item.replace && window.history?.replaceState) {
            window.history.replaceState(null, "", `#${item.to}`);
        } else {
            window.location.hash = item.to;
        }
    }
};

defineStyle(styles);

const Breadcrumb = defineHtml(html`
    <nav class="breadcrumb" aria-label="面包屑">
        <ol class="breadcrumb-list">
            <li
                v-for="item in visibleItems()"
                :key="item.key +
                                ':' +
                                (item.current ? 'active' : 'idle') +
                                ':' +
                                (item.last ? 'last' : 'mid')"
                :class="[
                                  'breadcrumb-item',
                                  { 'is-current': item.current, 'is-disabled': item.disabled, 'is-ellipsis': item.ellipsis }
                                ]"
            >
                <button
                    v-if="!item.current && !item.ellipsis"
                    type="button"
                    class="breadcrumb-link"
                    :disabled="item.disabled"
                    @click="onItemClick(item, $event)"
                >
                    {{ item.label }}
                </button>
                <span v-else class="breadcrumb-text" :aria-current="item.current ? 'page' : ''">
                    {{ item.label }}
                </span>
                <span v-if="!item.last" class="breadcrumb-separator" aria-hidden="true">
                    <elf-icon
                        v-if=${props.separatorIcon}
                        class="breadcrumb-separator-icon"
                        :name=${props.separatorIcon}
                    ></elf-icon>
                    <span v-else>${props.separator || "/"}</span>
                </span>
            </li>
        </ol>
    </nav>
`);

export { Breadcrumb };
