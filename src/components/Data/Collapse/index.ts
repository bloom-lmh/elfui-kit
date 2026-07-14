import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    useEventListener,
    useHost,
    useRef,
    watchEffect,
} from "elfui";

import styles from "./style.scss?inline";
import type { CollapseFieldNames, CollapseItem, CollapseItemProps, CollapseModelValue, CollapseProps } from "./types";

export type {
    CollapseFieldNames,
    CollapseItem,
    CollapseItemProps,
    CollapseItemSlots,
    CollapseModelValue,
    CollapseProps,
} from "./types";

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
        default: () => ({ name: "name", title: "title", content: "content", disabled: "disabled" }),
    },
});

const emit = defineEmits(["update:modelValue", "change"]);
const active = useRef<string[]>([]);
const host = useHost();
const hasItemChildren = useRef(false);

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
        disabled: value.disabled || "disabled",
    };
};

const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map((item) => String(item));
    return value === null || value === undefined || value === "" ? [] : [String(value)];
};

watchEffect(() => {
    active.set(toArray(props.modelValue));
});

interface CollapseItemElement extends HTMLElement {
    name?: string | number;
    disabled?: boolean;
    active?: boolean;
}

const itemChildren = (): CollapseItemElement[] =>
    Array.from(host.children).filter(
        (child): child is CollapseItemElement => child.tagName.toLowerCase() === "elf-collapse-item",
    );

const childName = (child: CollapseItemElement, index: number): string =>
    child.name === undefined || child.name === null || child.name === "" ? String(index) : String(child.name);

const syncItemChildren = (): void => {
    const children = itemChildren();
    hasItemChildren.set(children.length > 0);
    children.forEach((child, index) => {
        child.active = active.value.includes(childName(child, index));
    });
};

const onItemsSlotChange = (): void => syncItemChildren();

watchEffect(() => {
    active.value;
    syncItemChildren();
});

onMount(syncItemChildren);

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
            disabled: Boolean(raw[fields.disabled]),
        };
    });
};

const isActive = (item: ViewItem): boolean => active.value.includes(item.name);

const panelId = (item: ViewItem): string => `${id}-panel-${encodeURIComponent(item.name)}`;
const headerId = (item: ViewItem): string => `${id}-header-${encodeURIComponent(item.name)}`;

const outputValue = (next: string[]): CollapseModelValue => (props.accordion ? next[0] || "" : next);

const toggle = (name: string, disabled = false): void => {
    if (disabled) return;
    const current = active.value;
    const opened = current.includes(name);
    const next = props.accordion
        ? opened
            ? []
            : [name]
        : opened
          ? current.filter((activeName) => activeName !== name)
          : [...current, name];
    active.set(next);
    const detail = outputValue(next);
    emit("update:modelValue", detail);
    emit("change", detail);
};

const onHeaderClick = (event: Event): void => {
    const name = (event.currentTarget as HTMLElement | null)?.dataset.name;
    const item = viewItems().find((entry) => entry.name === name);
    if (item) toggle(item.name, item.disabled);
};

useEventListener(host, "elf-collapse-toggle", (event) => {
    event.stopPropagation();
    const child = event.target as CollapseItemElement | null;
    const children = itemChildren();
    const index = child ? children.indexOf(child) : -1;
    if (!child || index < 0) return;
    toggle(childName(child, index), Boolean(child.disabled));
});

defineStyle(styles);

const Collapse = defineHtml<CollapseProps>(html`
    <div class="collapse" part="collapse">
        <slot v-if=${hasItemChildren} @slotchange=${onItemsSlotChange}></slot>
        <template v-if=${!hasItemChildren}>
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
                    <span class="arrow" aria-hidden="true"></span>
                </button>
                <div class="body" part="body" :id="panelId(item)" role="region" :aria-labelledby="headerId(item)">
                    <div class="body-content">
                        {{ item.content }}
                        <slot></slot>
                    </div>
                </div>
            </div>
        </template>
    </div>
`);

export { Collapse };
