// elf-tooltip — 文字气泡提示
//
//   <elf-tooltip content="这是提示文字" placement="top">
//     <elf-button>悬浮我</elf-button>
//   </elf-tooltip>

import {
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useClickOutside,
  useComputed,
  useEffect,
  useHost,
  useRef,
  defineHtml
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TooltipProps } from "./types";

export type { TooltipProps } from "./types";

const props = defineProps({
  content: { type: String, default: "" },
  placement: { type: String, default: "top" },
  disabled: { type: Boolean, default: false },
  trigger: { type: String, default: "hover" },
  showAfter: { type: Number, default: 0 },
  hideAfter: { type: Number, default: 0 },
  effect: { type: String, default: "dark" },
  visible: { type: Boolean, default: undefined }
}) as unknown as Readonly<TooltipProps>;

const host = useHost();

const visible = useRef(false);
const rendered = useRef(false);
const closing = useRef(false);

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const clearTimers = (): void => {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = null;
  hideTimer = null;
};

const show = (): void => {
  if (props.disabled) return;
  clearTimers();
  const delay = Number(props.showAfter) || 0;
  if (delay > 0) {
    showTimer = setTimeout(() => {
      visible.set(true);
    }, delay);
  } else {
    visible.set(true);
  }
};

const hide = (): void => {
  clearTimers();
  const delay = Number(props.hideAfter) || 0;
  if (delay > 0) {
    hideTimer = setTimeout(() => {
      visible.set(false);
    }, delay);
  } else {
    visible.set(false);
  }
};

useEffect(() => {
  const isVisible = visible.value;
  if (isVisible) {
    rendered.set(true);
    closing.set(false);
  } else {
    if (rendered.peek() && !closing.peek()) {
      closing.set(true);
      const timer = setTimeout(() => {
        rendered.set(false);
        closing.set(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }
});

useEffect(() => {
  if (props.trigger === "manual" || props.visible !== undefined) {
    if (props.visible !== undefined) {
      visible.set(Boolean(props.visible));
    }
  }
});

const onMouseEnter = (): void => {
  if (props.trigger !== "hover") return;
  show();
};

const onMouseLeave = (): void => {
  if (props.trigger !== "hover") return;
  hide();
};

const onFocusIn = (): void => {
  if (props.trigger !== "focus") return;
  show();
};

const onFocusOut = (): void => {
  if (props.trigger !== "focus") return;
  hide();
};

const onClick = (): void => {
  if (props.trigger !== "click") return;
  if (visible.value) {
    hide();
  } else {
    show();
  }
};

const onContextMenu = (e: MouseEvent): void => {
  if (props.trigger !== "contextmenu") return;
  e.preventDefault();
  if (visible.value) {
    hide();
  } else {
    show();
  }
};

useClickOutside(host, () => {
  if (props.trigger === "click" || props.trigger === "contextmenu") {
    hide();
  }
});

const tooltipClass = useComputed((): string => {
  const p = props.placement || "top";
  const eff = props.effect || "dark";
  return `tooltip-content ${p} ${eff} ${closing.value ? "closing" : "active"}`;
});

defineExpose({
  show,
  hide,
  isVisible: () => visible.value
});

defineStyle(styles);

const Tooltip = defineHtml(html`
  <div
    class="tooltip-container"
    part="container"
    @mouseenter=${onMouseEnter}
    @mouseleave=${onMouseLeave}
    @focusin=${onFocusIn}
    @focusout=${onFocusOut}
    @click=${onClick}
    @contextmenu=${onContextMenu}
  >
    <slot></slot>
    <div v-if=${rendered} :class=${tooltipClass} part="content" role="tooltip">
      <slot name="content">${props.content}</slot>
      <div class="arrow" part="arrow"></div>
    </div>
  </div>
`);

export { Tooltip };
