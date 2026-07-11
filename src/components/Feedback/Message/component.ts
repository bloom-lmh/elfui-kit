// elf-message element

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostFlag,
  useRef,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";

const ICONS: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "×",
  error: "×"
};

const props = defineProps({
  message: { type: String, default: "" },
  type: { type: String, default: "info" },
  position: { type: String, default: "top" },
  closable: { type: Boolean, default: false }
});

const emit = defineEmits(["close"]);
const closing = useRef(false);

useHostFlag("data-closing", () => closing.value);
useHostAttr("position", () => (props.position === "bottom" ? "bottom" : "top"));

const close = (): void => {
  closing.set(true);
  emit("close");
};

const icon = (): string => ICONS[String(props.type)] ?? "i";

defineExpose({ close, closing });
defineStyle(styles);

const Message = defineHtml(html`
  <div class="message" part="message" role="status" aria-live="polite" aria-atomic="true">
    <span class="icon">${icon()}</span>
    <span class="content"><slot>${props.message}</slot></span>
    <button
      v-if=${props.closable}
      class="close"
      type="button"
      @click.stop=${close}
      aria-label="关闭"
    >
      ×
    </button>
  </div>
`);

export { Message };
