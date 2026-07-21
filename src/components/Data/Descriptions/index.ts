import {
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useComputed,
    useHost,
    useHostAttr,
    useHostCssVar,
    useHostFlag,
    useRef,
    watchEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
    DescriptionItem,
    DescriptionsDirection,
    DescriptionsFieldNames,
    DescriptionsProps,
    DescriptionsSize,
} from "./types";

export type {
    DescriptionItem,
    DescriptionsDirection,
    DescriptionsFieldNames,
    DescriptionsProps,
    DescriptionsSize,
} from "./types";

interface ViewItem {
    key: string;
    label: string;
    text: string;
    span: number;
}

const props = defineProps<DescriptionsProps>({
    title: { type: String, default: "" },
    extra: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    column: { type: Number, default: 3 },
    border: { type: Boolean, default: false },
    direction: { type: String, default: "horizontal" },
    size: { type: String, default: "" },
    props: {
        type: Object,
        default: () => ({ label: "label", value: "value", span: "span" }),
    },
});

const host = useHost();
const hasItemChildren = useRef(false);
const showDataItems = useComputed(() => !hasItemChildren.value);
const managedChildren = new WeakMap<HTMLElement, { direction: string | null; size: string | null }>();

const fieldNames = (): Required<DescriptionsFieldNames> => {
    const value = props.props || {};
    return {
        label: value.label || "label",
        value: value.value || "value",
        span: value.span || "span",
    };
};

const column = (): number => Math.max(1, Math.min(8, Number(props.column) || 3));

const items = (): ViewItem[] => {
    const fields = fieldNames();
    const source = Array.isArray(props.items) ? props.items : [];
    return source.map((entry, index) => {
        const raw = (entry || {}) as Record<string, unknown>;
        return {
            key: String(raw[fields.label] ?? index),
            label: String(raw[fields.label] ?? ""),
            text: String(raw[fields.value] ?? ""),
            span: Math.max(1, Math.min(column(), Number(raw[fields.span]) || 1)),
        };
    });
};

const direction = (): DescriptionsDirection => (props.direction === "vertical" ? "vertical" : "horizontal");

const size = (): DescriptionsSize => {
    const value = String(props.size || "") as DescriptionsSize;
    return value === "sm" || value === "lg" ? value : "";
};

const itemChildren = (): HTMLElement[] =>
    Array.from(host.children).filter(
        (child): child is HTMLElement => child.tagName.toLowerCase() === "elf-descriptions-item",
    );

const syncItemChildren = (): void => {
    const children = itemChildren();
    hasItemChildren.set(children.length > 0);
    children.forEach((child) => {
        if (!managedChildren.has(child)) {
            managedChildren.set(child, {
                direction: child.getAttribute("data-direction"),
                size: child.getAttribute("data-size"),
            });
        }
        child.setAttribute("data-direction", direction());
        const nextSize = size();
        if (nextSize) child.setAttribute("data-size", nextSize);
        else child.removeAttribute("data-size");
    });
};

const restoreItemChildren = (): void => {
    itemChildren().forEach((child) => {
        const state = managedChildren.get(child);
        if (!state) return;
        if (state.direction === null) child.removeAttribute("data-direction");
        else child.setAttribute("data-direction", state.direction);
        if (state.size === null) child.removeAttribute("data-size");
        else child.setAttribute("data-size", state.size);
    });
};

const onItemsSlotChange = (): void => syncItemChildren();

useHostAttr("direction", direction);
useHostAttr("size", size);
useHostFlag("border", () => Boolean(props.border));
useHostCssVar("--_column", () => String(column()));

watchEffect(() => {
    props.direction;
    props.size;
    syncItemChildren();
});

onMount(syncItemChildren);
onUnmount(restoreItemChildren);

defineStyle(styles);

const Descriptions = defineHtml<DescriptionsProps>(html`
    <section class="descriptions" part="descriptions">
        <header v-if=${props.title || props.extra} class="header">
            <div class="title"><slot name="title">${props.title}</slot></div>
            <div class="extra"><slot name="extra">${props.extra}</slot></div>
        </header>
        <div class="grid" part="body">
            <slot v-if=${hasItemChildren} @slotchange=${onItemsSlotChange}></slot>
            <template v-if=${showDataItems}>
                <div v-for="item in items()" :key="item.key" class="item" :style="{ gridColumn: 'span ' + item.span }">
                    <div class="label">{{ item.label }}</div>
                    <div class="content">{{ item.text }}</div>
                </div>
            </template>
        </div>
    </section>
`);

export { Descriptions };
