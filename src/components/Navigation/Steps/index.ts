// elf-steps — 步骤条

import {
    defineEmits,
    defineExpose,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    useComputed,
    useHost,
    useHostAttr,
    useHostFlag,
    useEffect,
    useRef,
    useResizeObserver,
} from "elfui";

import styles from "./style.scss?inline";
import type { StepItem, StepsChangeDetail, StepsDirection, StepsProps, StepsSize } from "./types";

export type { StepItem, StepsChangeDetail, StepsDirection, StepsProps, StepsSize, StepStatus } from "./types";

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
let lastControlledActive = Number.NaN;

const rawItems = (): StepItem[] => (Array.isArray(props.items) ? (props.items as StepItem[]) : []);
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

const Steps = defineHtml<StepsProps>(html`
    <div :class=${rootClass} :style=${rootStyle} role="list" :aria-orientation=${direction()}>
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
    </div>
`);

export { Steps };
