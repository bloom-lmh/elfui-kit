// elf-dialog

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
    useRef,
    useScrollLock,
    defineHtml,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";

export type { DialogProps, DialogSize } from "./types";

globalStyle(styles);

const props = defineProps({
    title: { type: String, default: "" },
    size: { type: String, default: "md" },
    closeOnMask: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closable: { type: Boolean, default: true },
    lockScroll: { type: Boolean, default: true },
    beforeClose: { type: Function, default: null },
});

const emit = defineEmits(["close", "closed", "opened"]);
const model = defineModel<boolean>("open", { default: false });
const locale = useLocaleProvider();

const nextId = (): string => {
    const store = globalThis as typeof globalThis & { __elfDialogIdSeed?: number };
    store.__elfDialogIdSeed = (store.__elfDialogIdSeed ?? 0) + 1;
    return `elf-dialog-${store.__elfDialogIdSeed}`;
};

const host = useHost();
const id = nextId();
const titleId = `${id}-title`;
const rendered = useRef(false);
const closing = useRef(false);
let closeTimer: number | null = null;

const rootSelector = `[data-elf-dialog="${id}"]`;
const projection = projectLightDom(host, {
    defaultTarget: () => document.querySelector(rootSelector)?.querySelector(".elf-dialog-body"),
    slots: {
        footer: () => document.querySelector(rootSelector)?.querySelector(".elf-dialog-footer"),
    },
});

const panelClass = (): string => {
    const size = props.size || "md";
    return `elf-dialog-panel dialog size-${size} ${size}`;
};

const maskClass = (): Record<string, boolean> => ({
    "elf-dialog-closing": closing.value,
});

const cleanupTimer = (): void => {
    if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
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
        scheduleProject();
        return;
    }

    if (!rendered.peek() || closing.peek()) return;
    closing.set(true);
    closeTimer = window.setTimeout(() => {
        restoreContent();
        rendered.set(false);
        closing.set(false);
        closeTimer = null;
        emit("closed");
    }, 220);
});

onBeforeUnmount(() => {
    cleanupTimer();
    restoreContent();
    removeTeleportedRoot();
});

defineExpose({ close: () => void requestClose() });
defineStyle(styles);

const Dialog = defineHtml(html`
    <Teleport to="body">
        <div
            v-if=${rendered}
            class="elf-dialog-mask mask"
            :class=${maskClass()}
            :data-elf-dialog=${id}
            role="presentation"
            @click=${onMaskClick}
        >
            <section
                :class=${panelClass()}
                role="dialog"
                aria-modal="true"
                :aria-labelledby=${props.title ? titleId : null}
            >
                <header class="elf-dialog-header" v-if=${props.title || props.closable}>
                    <span class="elf-dialog-title" :id=${titleId}>${title}</span>
                    <button
                        v-if=${props.closable}
                        class="elf-dialog-close close"
                        type="button"
                        :aria-label=${locale.t("a11y.closeDialog")}
                        @click=${onCloseClick}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18"></path>
                        </svg>
                    </button>
                </header>
                <div class="elf-dialog-body"></div>
                <footer class="elf-dialog-footer"></footer>
            </section>
        </div>
    </Teleport>
`);

export { Dialog };
