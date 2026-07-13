import {
    defineEmits,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useHost,
    useHostCssVar,
    useHostFlag,
    useRef,
    defineHtml,
} from "elfui";

import styles from "./style.scss?inline";

export type { StickyProps } from "./types";

const cssSize = (value: unknown, fallback = "0px"): string => {
    if (value == null || value === "") return fallback;
    return typeof value === "number" ? `${value}px` : String(value);
};

const readNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    const parsed = Number.parseFloat(String(value || "0"));
    return Number.isFinite(parsed) ? parsed : 0;
};

const props = defineProps({
    top: { type: null, default: 0 },
    bottom: { type: null, default: "" },
    zIndex: { type: null, default: 10 },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["change"]);

const host = useHost();

const stuck = useRef(false);

let cleanup = (): void => {};

let ticking = false;

let scrollParent: Window | HTMLElement | null = null;

useHostCssVar("--sticky-top", () => cssSize(props.top, "0px"));

useHostCssVar("--sticky-bottom", () => cssSize(props.bottom, "0px"));

useHostCssVar("--sticky-z-index", () => String(props.zIndex || 10));

useHostFlag("disabled", () => Boolean(props.disabled));

useHostFlag("data-bottom", () => props.bottom !== "" && props.bottom != null);

useHostFlag("data-stuck", () => stuck.value);

const update = (): void => {
    ticking = false;
    if (props.disabled || typeof window === "undefined") {
        if (stuck.peek()) {
            stuck.set(false);
            emit("change", false);
        }
        return;
    }
    const rect = host.getBoundingClientRect();
    const target = scrollParent || window;
    const parentRect =
        target === window ? { top: 0, bottom: window.innerHeight } : (target as HTMLElement).getBoundingClientRect();
    const topBoundary = parentRect.top + readNumber(props.top);
    const bottomBoundary = parentRect.bottom - readNumber(props.bottom);
    const next = props.bottom !== "" && props.bottom != null ? rect.bottom >= bottomBoundary : rect.top <= topBoundary;
    if (next !== stuck.peek()) {
        stuck.set(next);
        emit("change", next);
    }
};

const requestUpdate = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
};

const isScrollable = (element: HTMLElement): boolean => {
    const inline = `${element.style.overflow} ${element.style.overflowY} ${element.style.overflowX}`;
    const computed = window.getComputedStyle(element);
    const value = `${inline} ${computed.overflow} ${computed.overflowY} ${computed.overflowX}`;
    return /(auto|scroll|overlay)/.test(value);
};

const findScrollParent = (): Window | HTMLElement => {
    let parent = host.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
        if (isScrollable(parent)) return parent;
        parent = parent.parentElement;
    }
    return window;
};

onMount(() => {
    if (typeof window === "undefined") return;
    const target = findScrollParent();
    scrollParent = target;
    target.addEventListener("scroll", requestUpdate);
    window.addEventListener("resize", requestUpdate);
    cleanup = () => {
        target.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
    };
    requestUpdate();
});

onUnmount(() => cleanup());

defineStyle(styles);

const Sticky = defineHtml(html`<div class="sticky" part="root"><slot></slot></div>`);

export { Sticky };
