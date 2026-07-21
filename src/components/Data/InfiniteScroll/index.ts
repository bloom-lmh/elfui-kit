import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    onMount,
    onUnmount,
    useHost,
    watchEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { InfiniteScrollEmits, InfiniteScrollProps, InfiniteScrollSlots } from "./types";

export type {
    InfiniteScrollDirectiveHandler,
    InfiniteScrollDirectiveOptions,
    InfiniteScrollDirectiveValue,
    InfiniteScrollEmits,
    InfiniteScrollProps,
    InfiniteScrollSlots,
} from "./types";

const props = defineProps<InfiniteScrollProps>({
    disabled: { type: Boolean, default: false },
    distance: { type: Number, default: 0 },
    delay: { type: Number, default: 200 },
    immediate: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    height: { type: null, default: "280px" },
    container: { type: [String, Object], default: null },
});

const emit = defineEmits<InfiniteScrollEmits>();
const host = useHost();
let target: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

const canLoad = (): boolean => !props.disabled && !props.loading;

const viewportStyle = (): Record<string, string> => {
    const height = props.height;
    if (height === "" || height == null) return {};
    return { height: typeof height === "number" ? `${height}px` : String(height) };
};

const load = (): void => {
    if (canLoad()) emit("load");
};

const clearTimer = (): void => {
    if (timer) clearTimeout(timer);
    timer = undefined;
};

const scheduleLoad = (): void => {
    if (!canLoad() || timer) return;
    const delay = Math.max(0, Number(props.delay) || 0);
    if (delay === 0) {
        load();
        return;
    }
    timer = setTimeout(() => {
        timer = undefined;
        load();
    }, delay);
};

const onScroll = (event: Event): void => {
    const el = event.currentTarget as HTMLElement;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= Math.max(0, Number(props.distance) || 0)) scheduleLoad();
};

const checkTarget = (): void => {
    if (!target) return;
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (remaining <= Math.max(0, Number(props.distance) || 0)) scheduleLoad();
};

const resolveContainer = (): HTMLElement | null => {
    if (props.container instanceof HTMLElement) return props.container;
    if (typeof props.container === "string" && props.container.trim()) {
        return document.querySelector<HTMLElement>(props.container);
    }
    return host.shadowRoot?.querySelector<HTMLElement>(".scroll") ?? null;
};

const detach = (): void => {
    target?.removeEventListener("scroll", onScroll);
    target = null;
};

const attach = (): void => {
    detach();
    target = resolveContainer();
    target?.addEventListener("scroll", onScroll, { passive: true });
};

onMount(() => {
    attach();
    if (props.immediate) queueMicrotask(checkTarget);
});

watchEffect(() => {
    props.container;
    attach();
});

onUnmount(() => {
    clearTimer();
    detach();
});

defineStyle(styles);

const InfiniteScroll = defineHtml<InfiniteScrollProps, InfiniteScrollEmits, InfiniteScrollSlots>(html`
    <div class="scroll" part="scroll" :style=${viewportStyle()}>
        <slot></slot>
    </div>
`);

export { InfiniteScroll };
