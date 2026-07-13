// elf-drawer

import {
    defineEmits,
    defineExpose,
    defineModel,
    defineProps,
    defineStyle,
    globalStyle,
    html,
    onBeforeUnmount,
    projectLightDom,
    useEffect,
    useEscapeKey,
    useHost,
    useHostAttr,
    useRef,
    useScrollLock,
    defineHtml,
} from "elfui";

import styles from "./style.scss?inline";

export type { DrawerDirection, DrawerProps } from "./types";

globalStyle(styles);

const props = defineProps({
    title: { type: String, default: "" },
    direction: { type: String, default: "rtl" },
    size: { type: String, default: "30%" },
    modal: { type: Boolean, default: true },
    closeOnMask: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true },
    beforeClose: { type: Function, default: null },
});

const emit = defineEmits(["close", "closed", "opened"]);
const model = defineModel<boolean>("open", { default: false });

const nextId = (): string => {
    const store = globalThis as typeof globalThis & {
        __elfDrawerIdSeed?: number;
    };
    store.__elfDrawerIdSeed = (store.__elfDrawerIdSeed ?? 0) + 1;
    return `elf-drawer-${store.__elfDrawerIdSeed}`;
};

const host = useHost();
const id = nextId();
const titleId = `${id}-title`;
const rendered = useRef(false);
const closing = useRef(false);
const maskClosing = useRef(false);
let panelTimer: number | null = null;
const PANEL_LEAVE_MS = 240;

const rootSelector = `[data-elf-drawer="${id}"]`;
const projection = projectLightDom(host, {
    defaultTarget: () => document.querySelector(rootSelector)?.querySelector(".elf-drawer-body"),
});

const panelClass = (): string => {
    const direction = String(props.direction || "rtl");
    return `elf-drawer-panel drawer ${direction}`;
};

const maskClass = (): Record<string, boolean> => ({
    closing: closing.value,
    "mask-closing": maskClosing.value,
    "no-modal": !props.modal,
});

const panelStyle = (): Record<string, string> => {
    const direction = String(props.direction || "rtl");
    const key = direction === "ltr" || direction === "rtl" ? "width" : "height";
    return { [key]: String(props.size || "30%") };
};

const cleanupTimer = (): void => {
    if (panelTimer !== null) {
        window.clearTimeout(panelTimer);
        panelTimer = null;
    }
};

const projectContent = (): boolean => {
    return projection.project();
};

const scheduleProject = (): void => {
    queueMicrotask(() => {
        if (!projectContent()) queueMicrotask(projectContent);
    });
};

const restoreContent = (): void => {
    projection.restore();
};

const removeTeleportedRoot = (): void => {
    document.querySelector(rootSelector)?.remove();
};

const requestClose = async (): Promise<void> => {
    if (closing.peek()) return;
    const before = props.beforeClose as unknown as (() => boolean | Promise<boolean>) | null;
    if (typeof before === "function") {
        try {
            if ((await before()) === false) return;
        } catch {
            return;
        }
    }
    model.set(false);
    emit("close");
};

const onCloseClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    void requestClose();
};

const onMaskClick = (event: MouseEvent): void => {
    if (event.target === event.currentTarget && props.closeOnMask) {
        void requestClose();
    }
};

useHostAttr("direction", () => props.direction || "rtl");
useScrollLock(() => Boolean(props.lockScroll) && rendered.value);
useEscapeKey(() => {
    if (rendered.value && props.closeOnEscape) void requestClose();
});

useEffect(() => {
    if (model.value) {
        cleanupTimer();
        if (!rendered.peek()) {
            rendered.set(true);
            emit("opened");
        }
        closing.set(false);
        maskClosing.set(false);
        scheduleProject();
        return;
    }

    if (!rendered.peek() || closing.peek()) return;
    closing.set(true);
    maskClosing.set(true);
    panelTimer = window.setTimeout(() => {
        restoreContent();
        rendered.set(false);
        closing.set(false);
        maskClosing.set(false);
        panelTimer = null;
        emit("closed");
    }, PANEL_LEAVE_MS);
});

onBeforeUnmount(() => {
    cleanupTimer();
    restoreContent();
    removeTeleportedRoot();
});

defineExpose({ close: () => void requestClose() });
defineStyle(styles);

const Drawer = defineHtml(html`
    <Teleport to="body">
        <div
            v-if=${rendered}
            class="elf-drawer-mask mask"
            :class=${maskClass()}
            :data-elf-drawer=${id}
            role="presentation"
            @click=${onMaskClick}
        >
            <aside
                :class=${panelClass()}
                :style=${panelStyle()}
                role="dialog"
                aria-modal="true"
                :aria-labelledby=${props.title ? titleId : null}
            >
                <header class="elf-drawer-header" v-if=${props.title || props.closable}>
                    <span class="elf-drawer-title" :id=${titleId}>${title}</span>
                    <button
                        v-if=${props.closable}
                        class="elf-drawer-close close"
                        type="button"
                        aria-label="关闭"
                        @click=${onCloseClick}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18"></path>
                        </svg>
                    </button>
                </header>
                <div class="elf-drawer-body"></div>
            </aside>
        </div>
    </Teleport>
`);

export { Drawer };
