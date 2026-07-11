// elf-notification element

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
  error: "×"
};

const props = defineProps({
  titleText: { type: String, default: "" },
  message: { type: String, default: "" },
  type: { type: String, default: "" },
  position: { type: String, default: "top-right" },
  closable: { type: Boolean, default: true }
});

const emit = defineEmits(["close"]);
const closing = useRef(false);

useHostFlag("data-closing", () => closing.value);
useHostAttr("position", () => props.position as string);

const close = (): void => {
  closing.set(true);
  emit("close");
};

const icon = (): string => ICONS[String(props.type)] ?? "";

defineExpose({ close, closing });
defineStyle(styles);

const Notification = defineHtml(html`
  <div class="notification" part="notification" role="status">
    <div v-if=${props.type} :class=${["icon-box", props.type]}>
      <span class="icon">${icon()}</span>
    </div>
    <div class="content-wrapper">
      <h2 v-if=${props.titleText} class="title">${props.titleText}</h2>
      <div class="message"><slot>${props.message}</slot></div>
    </div>
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

export { Notification };
