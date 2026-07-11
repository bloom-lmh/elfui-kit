// elf-pop-confirm — 气泡确认框

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onBeforeUnmount,
  useClickOutside,
  useEffect,
  useEscapeKey,
  useFocusTrap,
  useHost,
  useHostFlag,
  useRef,
  useTemplateRef
} from "elfui";

import styles from "./style.scss?inline";
import type { PopConfirmPlacement, PopConfirmProps, PopConfirmTrigger } from "./types";

export type { PopConfirmPlacement, PopConfirmProps, PopConfirmTrigger } from "./types";

const props = defineProps<PopConfirmProps>({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  confirmText: { type: String, default: "确认" },
  cancelText: { type: String, default: "取消" },
  placement: { type: String, default: "top" },
  trigger: { type: String, default: "click" },
  visible: { type: Boolean, default: undefined },
  width: { type: String, default: "260px" },
  disabled: { type: Boolean, default: false },
  closeOnEscape: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true }
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  open: [];
  close: [];
  "update:visible": [visible: boolean];
}>();

const host = useHost();
const panelRef = useTemplateRef<HTMLElement>("panel");
const openState = useRef(false);
const rendered = useRef(false);
const closing = useRef(false);

let hideTimer: ReturnType<typeof setTimeout> | null = null;
let previousActive: HTMLElement | null = null;
let cleanupPanelKeydown = (): void => {};

const isControlled = (): boolean => props.visible !== undefined;
const isOpen = (): boolean => (isControlled() ? Boolean(props.visible) : openState.value);
const trigger = (): PopConfirmTrigger =>
  props.trigger === "hover" || props.trigger === "focus" || props.trigger === "manual"
    ? props.trigger
    : "click";
const placement = (): PopConfirmPlacement =>
  props.placement === "bottom" || props.placement === "left" || props.placement === "right"
    ? props.placement
    : "top";

const clearTimers = (): void => {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = null;
};

const focusPanel = (): void => {
  let attempts = 0;
  const focusWhenReady = (): void => {
    const panel =
      panelRef.peek() ||
      host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") ||
      null;
    if (!panel) {
      attempts += 1;
      if (attempts < 5) queueMicrotask(focusWhenReady);
      return;
    }
    bindPanelKeydown(panel);
    const first = queryPanelFocusables()[0];
    (first || panel).focus();
  };
  queueMicrotask(focusWhenReady);
};

const queryPanelFocusables = (): HTMLElement[] => {
  const panel =
    panelRef.peek() || host.shadowRoot?.querySelector<HTMLElement>(".pop-confirm-popover") || null;
  if (!panel) return [];
  return Array.from(
    panel.querySelectorAll<HTMLElement>(
      "button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )
  );
};

const onPanelKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Tab") return;
  const items = queryPanelFocusables();
  if (items.length === 0) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = host.shadowRoot?.activeElement || document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

const bindPanelKeydown = (panel: HTMLElement): void => {
  cleanupPanelKeydown();
  panel.addEventListener("keydown", onPanelKeydown);
  panel.onkeydown = onPanelKeydown;
  cleanupPanelKeydown = () => {
    panel.removeEventListener("keydown", onPanelKeydown);
    panel.onkeydown = null;
    cleanupPanelKeydown = (): void => {};
  };
};

const restoreFocus = (): void => {
  if (previousActive && typeof previousActive.focus === "function") {
    previousActive.focus();
  }
  previousActive = null;
};

const setOpen = (next: boolean): void => {
  if (props.disabled && next) return;
  if (isOpen() === next) return;
  if (next) previousActive = document.activeElement as HTMLElement | null;
  if (!isControlled()) openState.set(next);
  emit("update:visible", next);
  emit(next ? "open" : "close");
};

const show = (): void => setOpen(true);
const hide = (): void => setOpen(false);
const toggle = (): void => setOpen(!isOpen());

const confirm = (): void => {
  emit("confirm");
  hide();
};

const cancel = (): void => {
  emit("cancel");
  hide();
};

const onClick = (): void => {
  if (trigger() !== "click") return;
  toggle();
};

const onMouseEnter = (): void => {
  if (trigger() !== "hover") return;
  show();
};

const onMouseLeave = (): void => {
  if (trigger() !== "hover") return;
  hide();
};

const onFocusIn = (): void => {
  if (trigger() !== "focus") return;
  show();
};

const onFocusOut = (event: Event): void => {
  if (trigger() !== "focus") return;
  const next = (event as FocusEvent).relatedTarget as Node | null;
  if (next && (host.contains(next) || host.shadowRoot?.contains(next))) return;
  hide();
};

useClickOutside(host, () => {
  if (props.closeOnClickOutside && trigger() !== "manual") hide();
});
useEscapeKey(() => {
  if (rendered.value && props.closeOnEscape && trigger() !== "manual") hide();
});
useFocusTrap(host);

useEffect(() => {
  if (isOpen()) {
    clearTimers();
    if (!rendered.peek()) rendered.set(true);
    closing.set(false);
    focusPanel();
    return;
  }

  if (!rendered.peek() || closing.peek()) return;
  closing.set(true);
  hideTimer = setTimeout(() => {
    rendered.set(false);
    closing.set(false);
    cleanupPanelKeydown();
    clearTimers();
    restoreFocus();
  }, 140);
});

onBeforeUnmount(() => {
  clearTimers();
  cleanupPanelKeydown();
  restoreFocus();
});

const popoverClass = (): string =>
  [
    "pop-confirm-popover",
    `placement-${placement()}`,
    closing.value ? "is-closing" : "is-open"
  ].join(" ");

useHostFlag("data-open", () => isOpen());
useHostFlag("disabled", () => props.disabled);

defineExpose({ show, hide, toggle, isVisible: () => isOpen() });
defineStyle(styles);

const PopConfirm = defineHtml<PopConfirmProps>(html`
  <div
    class="pop-confirm"
    @click=${onClick}
    @mouseenter=${onMouseEnter}
    @mouseleave=${onMouseLeave}
    @focusin=${onFocusIn}
    @focusout="onFocusOut($event)"
  >
    <span class="pop-confirm-trigger" part="trigger">
      <slot></slot>
    </span>
    <section
      v-if=${rendered}
      ref="panel"
      :class=${popoverClass()}
      role="alertdialog"
      aria-modal="false"
      tabindex="-1"
      :style=${{ width: props.width }}
      part="popover"
      @click.stop
      @keydown=${onPanelKeydown}
    >
      <span class="pop-confirm-arrow" part="arrow"></span>
      <div class="pop-confirm-body">
        <slot name="content">
          <strong class="pop-confirm-title" v-if=${props.title}>${props.title}</strong>
          <span class="pop-confirm-content" v-if=${props.content}>${props.content}</span>
        </slot>
      </div>
      <div class="pop-confirm-actions">
        <button
          class="pop-confirm-action ghost"
          type="button"
          @click=${cancel}
          @keydown=${onPanelKeydown}
        >
          ${props.cancelText}
        </button>
        <button
          class="pop-confirm-action primary"
          type="button"
          @click=${confirm}
          @keydown=${onPanelKeydown}
        >
          ${props.confirmText}
        </button>
      </div>
    </section>
  </div>
`);

export { PopConfirm };
