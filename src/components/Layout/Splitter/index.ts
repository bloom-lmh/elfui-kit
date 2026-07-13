import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    useHostAttr,
    useHostCssVar,
    useHostFlag,
    useRef,
} from "elfui";

import styles from "./style.scss?inline";
import type { SplitterProps, SplitterSlots } from "./types";

export type { SplitterProps, SplitterSlots } from "./types";

const props = defineProps<SplitterProps>({
    modelValue: { type: Number, default: 50 },
    min: { type: Number, default: 10 },
    max: { type: Number, default: 90 },
    vertical: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change", "resize-start", "resize-end"]);
const dragging = useRef(false);

const clamp = (value: number): number => {
    const minVal = Number(props.min);
    const maxVal = Number(props.max);
    return Math.min(isNaN(maxVal) ? 90 : maxVal, Math.max(isNaN(minVal) ? 10 : minVal, value));
};

const currentSize = (): number => {
    const mv = props.modelValue;
    return clamp(mv != null ? Number(mv) : 50);
};

const percentageFromPointer = (bar: HTMLElement, clientX: number, clientY: number): number => {
    const container = bar.parentElement;
    if (!container) return currentSize();
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return currentSize();
    const raw = props.vertical
        ? ((clientY - rect.top) / rect.height) * 100
        : ((clientX - rect.left) / rect.width) * 100;
    return clamp(raw);
};

const onPointerDown = (event: PointerEvent): void => {
    if (props.disabled) return;
    event.preventDefault();
    const bar = event.currentTarget as HTMLElement;
    try {
        bar.setPointerCapture?.(event.pointerId);
    } catch {
        /* not available in test env */
    }
    dragging.set(true);
    emit("resize-start", currentSize());
};

const onPointerMove = (event: PointerEvent): void => {
    if (!dragging.value) return;
    event.preventDefault();
    const bar = event.currentTarget as HTMLElement;
    const next = percentageFromPointer(bar, event.clientX, event.clientY);
    emit("update:modelValue", next);
    emit("change", next);
};

const onPointerUp = (event: PointerEvent): void => {
    if (!dragging.value) return;
    dragging.set(false);
    const bar = event.currentTarget as HTMLElement;
    try {
        bar.releasePointerCapture?.(event.pointerId);
    } catch {
        // capture may already be released
    }
    emit("resize-end", currentSize());
};

const onLostPointerCapture = (): void => {
    if (dragging.value) {
        dragging.set(false);
        emit("resize-end", currentSize());
    }
};

const onKeyDown = (event: KeyboardEvent): void => {
    if (props.disabled) return;
    const step = 5;
    const cur = currentSize();
    let next: number;
    const keys = props.vertical
        ? { inc: ["ArrowDown", "ArrowRight"], dec: ["ArrowUp", "ArrowLeft"] }
        : { inc: ["ArrowRight", "ArrowDown"], dec: ["ArrowLeft", "ArrowUp"] };
    if (keys.inc.includes(event.key)) next = cur + step;
    else if (keys.dec.includes(event.key)) next = cur - step;
    else return;
    event.preventDefault();
    next = clamp(next);
    emit("update:modelValue", next);
    emit("change", next);
};

useHostAttr("vertical", () => (props.vertical ? "" : null));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostCssVar("--_splitter-size", () => `${currentSize()}%`);

defineStyle(styles);

const Splitter = defineHtml<SplitterProps, Record<string, unknown>, SplitterSlots>(html`
    <div class="splitter" part="splitter">
        <section class="pane first" part="first"><slot name="first"></slot></section>
        <div
            class="bar"
            part="bar"
            role="separator"
            tabindex="0"
            :aria-valuenow=${currentSize()}
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-orientation=${props.vertical ? "vertical" : "horizontal"}
            @pointerdown=${onPointerDown}
            @pointermove=${onPointerMove}
            @pointerup=${onPointerUp}
            @lostpointercapture=${onLostPointerCapture}
            @keydown=${onKeyDown}
        ></div>
        <section class="pane second" part="second"><slot name="second"></slot></section>
    </div>
`);

export { Splitter };
