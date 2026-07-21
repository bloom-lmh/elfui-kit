// elf-defaults-provider — 为子树批量提供组件默认 props
//
// 参考 Vuetify VDefaultsProvider。Web Components 没有统一 app 实例，
// 所以这里同时做两件事：
// 1) provide 一个可 inject 的 defaults context；
// 2) 对 light DOM 子组件实际写入默认 property/attribute，让现有组件立即可用。

import {
    defineProps,
    defineStyle,
    html,
    onMount,
    provide,
    useEffect,
    useHost,
    useTemplateRef,
    defineHtml,
} from "@elfui/core";

import {
    DEFAULTS_PROVIDER_KEY,
    type DefaultsProviderContext,
    type DefaultsStrategy,
    type ProviderDefaults,
} from "../context";
import styles from "./style.scss?inline";

export type { DefaultsProviderProps, DefaultsStrategy, ProviderDefaults } from "./types";

type LooseElement = HTMLElement & Record<string, unknown>;

const props = defineProps({
    defaults: { type: Object, default: () => ({}) },
    disabled: { type: Boolean, default: false },
    deep: { type: Boolean, default: true },
    strategy: { type: String, default: "missing" },
});

const host = useHost();

const slotRef = useTemplateRef<HTMLSlotElement>("slotEl");

const readDefaults = (): ProviderDefaults => {
    const value = props.defaults as unknown;
    if (!value) return {};
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value) as ProviderDefaults;
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch {
            return {};
        }
    }
    return value && typeof value === "object" ? (value as ProviderDefaults) : {};
};

const readStrategy = (): DefaultsStrategy => (props.strategy === "overwrite" ? "overwrite" : "missing");

const findConfig = (el: Element): Record<string, unknown> | undefined => {
    const defaults = readDefaults();
    const tag = el.tagName.toLowerCase();
    const short = tag.startsWith("elf-") ? tag.slice(4) : tag;
    const pascal = tag
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
    const shortPascal = short
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    return defaults[tag] ?? defaults[short] ?? defaults[pascal] ?? defaults[shortPascal];
};

const shouldSkip = (el: Element, propKey: string): boolean => {
    if (readStrategy() === "overwrite") return false;
    const attrName = toKebab(propKey);
    return el.hasAttribute(attrName) || el.hasAttribute(propKey);
};

const applyProp = (el: Element, propKey: string, value: unknown): void => {
    if (shouldSkip(el, propKey)) return;
    const target = el as LooseElement;
    const attrName = toKebab(propKey);
    target[propKey] = value;

    if (typeof value === "boolean") {
        if (value) el.setAttribute(attrName, "");
        else if (readStrategy() === "overwrite") el.removeAttribute(attrName);
        return;
    }
    if (typeof value === "string" || typeof value === "number") {
        el.setAttribute(attrName, String(value));
    }
};

const applyElement = (el: Element): void => {
    const config = findConfig(el);
    if (!config) return;
    for (const [key, value] of Object.entries(config)) {
        applyProp(el, key, value);
    }
};

const walk = (el: Element): void => {
    applyElement(el);
    if (!props.deep) return;
    for (const child of Array.from(el.children)) walk(child);
};

const assignedElements = (): Element[] => {
    const slot = slotRef.value;
    if (slot) return slot.assignedElements({ flatten: true });
    return Array.from(host.children);
};

const applyDefaults = (root?: ParentNode | Event): void => {
    if (props.disabled) return;
    const targetRoot = root && "children" in root ? root : undefined;
    const roots = targetRoot ? Array.from(targetRoot.children) : assignedElements();
    for (const child of roots) walk(child);
};

const context: DefaultsProviderContext = {
    get defaults() {
        return readDefaults();
    },
    get disabled() {
        return Boolean(props.disabled);
    },
    get strategy() {
        return readStrategy();
    },
    applyDefaults,
};

provide(DEFAULTS_PROVIDER_KEY, context);

onMount(() => {
    // Apply before slotted custom-element children finish mounting, so their
    // reflected default attributes are not mistaken for explicit user input.
    applyDefaults();
    queueMicrotask(() => applyDefaults());
});

useEffect(() => {
    readDefaults();
    readStrategy();
    Boolean(props.disabled);
    Boolean(props.deep);
    queueMicrotask(() => applyDefaults());
});

defineStyle(styles);

const DefaultsProvider = defineHtml(html`<slot ref="slotEl" @slotchange=${applyDefaults}></slot>`);

const toKebab = (value: string): string => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export { DefaultsProvider };
