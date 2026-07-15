// elf-steps — 步骤条

import {
    defineEmits,
    defineExpose,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    useComputed,
    useEventListener,
    useHost,
    useHostAttr,
    useHostFlag,
    useEffect,
    useRef,
    useResizeObserver,
} from "elfui";

import styles from "./style.scss?inline";
import type { StepItem, StepStatus, StepsChangeDetail, StepsDirection, StepsProps, StepsSize, StepsSlots } from "./types";

export type {
    StepItem,
    StepProps,
    StepSlots,
    StepStatus,
    StepsChangeDetail,
    StepsDirection,
    StepsExpose,
    StepsProps,
    StepsSize,
    StepsSlots,
} from "./types";

interface StepViewItem extends StepItem {
    key: string;
    title: string;
    description: string;
    icon: string;
    status: "wait" | "process" | "finish" | "error";
    index: number;
    isLast: boolean;
    isActive: boolean;
    isClickable: boolean;
}

interface StepElement extends HTMLElement {
    title?: string;
    description?: string;
    icon?: string;
    status?: StepStatus | "";
    disabled?: boolean;
    value?: string | number;
    stepIndex?: number;
    resolvedStatus?: StepStatus;
    active?: boolean;
    last?: boolean;
    clickable?: boolean;
    direction?: StepsDirection;
    size?: StepsSize;
    simple?: boolean;
    alignCenter?: boolean;
    alternativeLabel?: boolean;
    focusButton?: () => void;
}

interface StepNavigateDetail {
    index: number;
    key: string;
}

const props = defineProps<StepsProps>({
    active: { type: Number, default: 0 },
    direction: { type: String, default: "horizontal" },
    items: { type: Array, default: () => [] as StepItem[] },
    space: { type: [String, Number], default: "" },
    processStatus: { type: String, default: "process" },
    finishStatus: { type: String, default: "finish" },
    alignCenter: { type: Boolean, default: false },
    simple: { type: Boolean, default: false },
    size: { type: String, default: "md" },
    clickable: { type: Boolean, default: true },
    alternativeLabel: { type: Boolean, default: false },
});

const emit = defineEmits<{
    "update:active": [active: number];
    change: [detail: StepsChangeDetail];
}>();

const host = useHost();
const compact = useRef(false);
const currentActive = useRef(0);
const hasStepChildren = useRef(false);
let lastControlledActive = Number.NaN;

const stepChildren = (): StepElement[] =>
    Array.from(host.children).filter(
        (child): child is StepElement => child.tagName.toLowerCase() === "elf-step",
    );

const childItems = (): StepItem[] =>
    stepChildren().map((child, index) => ({
        title: child.title || `Step ${index + 1}`,
        description: child.description || "",
        icon: child.icon || "",
        status: child.status || undefined,
        disabled: Boolean(child.disabled),
        value: child.value ?? index,
    }));

const rawItems = (): StepItem[] =>
    hasStepChildren.value ? childItems() : Array.isArray(props.items) ? (props.items as StepItem[]) : [];
const count = (): number => rawItems().length;
const normalizeActive = (value: unknown): number => {
    const max = Math.max(0, count() - 1);
    const next = Math.trunc(Number(value) || 0);
    return Math.min(max, Math.max(0, next));
};
const clampedActive = (): number => normalizeActive(currentActive.value);
const direction = (): StepsDirection => (props.direction === "vertical" ? "vertical" : "horizontal");
const size = (): StepsSize => (props.size === "sm" || props.size === "lg" ? props.size : "md");
const normalizeStatus = (value: unknown, fallback: StepViewItem["status"]): StepViewItem["status"] =>
    value === "wait" || value === "process" || value === "finish" || value === "error" ? value : fallback;
const finishStatus = (): StepViewItem["status"] => normalizeStatus(props.finishStatus, "finish");
const processStatus = (): StepViewItem["status"] => normalizeStatus(props.processStatus, "process");
const normalizeSpace = (): string => {
    if (props.space === undefined || props.space === null || props.space === "") return "";
    if (typeof props.space === "number") return `${Math.max(0, props.space)}px`;
    const value = String(props.space).trim();
    return value ? value : "";
};

const inferStatus = (item: StepItem, index: number): StepViewItem["status"] => {
    if (item.status === "error" || item.status === "finish" || item.status === "process") {
        return item.status;
    }
    if (item.status === "wait") return "wait";
    const active = clampedActive();
    if (index < active) return finishStatus();
    if (index === active) return processStatus();
    return "wait";
};

const syncStepChildren = (): void => {
    const children = stepChildren();
    hasStepChildren.set(children.length > 0);
    if (children.length === 0) return;

    const items = childItems();
    const active = normalizeActive(currentActive.value);
    children.forEach((child, index) => {
        child.stepIndex = index;
        child.resolvedStatus = inferStatus(items[index]!, index);
        child.active = index === active;
        child.last = index === children.length - 1;
        child.clickable = Boolean(props.clickable);
        child.direction = direction();
        child.size = size();
        child.simple = Boolean(props.simple);
        child.alignCenter = Boolean(props.alignCenter);
        child.alternativeLabel = Boolean(props.alternativeLabel);
    });
};

const stepItems = useComputed<StepViewItem[]>(() => {
    const raw = rawItems();
    const active = clampedActive();
    return raw.map((item, index) => {
        const status = inferStatus(item, index);
        const stableKey = String(item.value ?? `${item.title}-${index}`);
        return {
            ...item,
            // Status is part of the key because the current compiler keeps keyed loop bindings stable.
            // Recreating only changed steps guarantees aria/class/icon state follows active immediately.
            key: `${stableKey}:${status}:${index === active ? "active" : "idle"}`,
            title: item.title || `Step ${index + 1}`,
            description: item.description || "",
            icon: item.icon || "",
            status,
            index,
            isLast: index === raw.length - 1,
            isActive: index === active,
            isClickable: Boolean(props.clickable) && !item.disabled && index !== active,
        };
    });
});

const rootClass = useComputed((): string => {
    const classes = ["steps", `is-${direction()}`, `size-${size()}`];
    if (compact.value) classes.push("is-compact");
    if (props.alternativeLabel) classes.push("is-alternative");
    if (props.alignCenter) classes.push("is-align-center");
    if (props.simple) classes.push("is-simple");
    if (normalizeSpace()) classes.push("has-space");
    if (hasStepChildren.value) classes.push("has-step-children");
    return classes.join(" ");
});

const rootStyle = useComputed((): Record<string, string> => {
    const space = normalizeSpace();
    return space ? { "--step-space": space } : {};
});

const stepItemClass = (item: StepViewItem): string => {
    const classes = ["step-item", `is-${item.status}`];
    if (item.isActive) classes.push("is-active");
    if (item.isClickable) classes.push("is-clickable");
    if (item.disabled) classes.push("is-disabled");
    return classes.join(" ");
};

const progressStyle = (item: StepViewItem): Record<string, string> => {
    if (item.isLast) return {};
    return { "--step-tail-progress": item.status === "finish" ? "100%" : "0%" };
};

const setActive = (index: number): void => {
    const items = rawItems();
    if (items.length === 0) return;
    const next = Math.min(items.length - 1, Math.max(0, Math.trunc(index)));
    const item = items[next]!;
    if (item.disabled || next === clampedActive()) return;
    currentActive.set(next);
    emit("update:active", next);
    emit("change", { active: next, item });
};

const next = (): void => setActive(clampedActive() + 1);
const prev = (): void => setActive(clampedActive() - 1);

const onStepClick = (item: StepViewItem): void => {
    if (!item.isClickable) return;
    setActive(item.index);
};

const focusStep = (index: number): void => {
    queueMicrotask(() => stepChildren()[index]?.focusButton?.());
};

const navigateStep = (detail: StepNavigateDetail): void => {
    const children = stepChildren();
    if (children.length === 0) return;
    const enabled = children
        .map((child, index) => ({ child, index }))
        .filter(({ child }) => !child.disabled)
        .map(({ index }) => index);
    if (enabled.length === 0) return;

    const currentPosition = Math.max(0, enabled.indexOf(detail.index));
    let nextPosition = currentPosition;
    if (detail.key === "Home") nextPosition = 0;
    else if (detail.key === "End") nextPosition = enabled.length - 1;
    else if (detail.key === "ArrowRight" || detail.key === "ArrowDown") {
        nextPosition = Math.min(enabled.length - 1, currentPosition + 1);
    } else if (detail.key === "ArrowLeft" || detail.key === "ArrowUp") {
        nextPosition = Math.max(0, currentPosition - 1);
    }

    const nextIndex = enabled[nextPosition]!;
    setActive(nextIndex);
    focusStep(nextIndex);
};

const onStepsSlotChange = (): void => syncStepChildren();

const statusIcon = (item: StepViewItem): string => {
    if (item.icon) return item.icon;
    if (item.status === "finish") return "✓";
    if (item.status === "error") return "!";
    return String(item.index + 1);
};

useResizeObserver(host, ({ width }) => {
    compact.set(width > 0 && width < 420);
});
useEffect(() => {
    const controlled = normalizeActive(props.active);
    if (controlled === lastControlledActive) return;
    lastControlledActive = controlled;
    currentActive.set(controlled);
});
useEffect(() => {
    void currentActive.value;
    void props.clickable;
    void props.direction;
    void props.size;
    void props.simple;
    void props.alignCenter;
    void props.alternativeLabel;
    void props.processStatus;
    void props.finishStatus;
    syncStepChildren();
});
useEventListener(host, "elf-step-select", (event) => {
    event.stopPropagation();
    const child = event.target as StepElement;
    const index = stepChildren().indexOf(child);
    if (index >= 0) setActive(index);
});
useEventListener(host, "elf-step-navigate", (event) => {
    event.stopPropagation();
    navigateStep((event as CustomEvent<StepNavigateDetail>).detail);
});
onMount(syncStepChildren);
useHostAttr("direction", direction);
useHostAttr("size", size);
useHostFlag("data-compact", () => compact.value);

defineExpose({
    get activeIndex() {
        return currentActive.peek();
    },
    next,
    prev,
    setActive,
});
defineStyle(styles);

const Steps = defineHtml<StepsProps, Record<string, never>, StepsSlots>(html`
    <div :class=${rootClass} :style=${rootStyle} role="list" :aria-orientation=${direction()}>
        <slot v-if=${hasStepChildren} @slotchange=${onStepsSlotChange}></slot>
        <template v-if=${!hasStepChildren}>
            <div
                v-for="item in stepItems"
                :key="item.key"
                :class="stepItemClass(item)"
                :style="progressStyle(item)"
                role="listitem"
            >
                <button
                    class="step-button"
                    type="button"
                    :disabled="item.disabled"
                    :tabindex="item.isActive ? 0 : -1"
                    :aria-current="item.isActive ? 'step' : null"
                    :aria-disabled="item.disabled ? 'true' : null"
                    @click="onStepClick(item)"
                >
                    <span class="step-head">
                        <span class="step-icon" aria-hidden="true">{{ statusIcon(item) }}</span>
                    </span>
                    <span class="step-main">
                        <span class="step-title">{{ item.title }}</span>
                        <span class="step-description" v-if="item.description">{{ item.description }}</span>
                    </span>
                </button>
                <span class="step-tail" v-if="!item.isLast" aria-hidden="true">
                    <span class="step-tail-track"></span>
                    <span class="step-tail-progress"></span>
                </span>
            </div>
        </template>
    </div>
`);

export { Steps };
