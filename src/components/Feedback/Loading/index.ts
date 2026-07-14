import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHostAttr,
  useHostCssVar
} from "elfui";

import styles from "./style.scss?inline";
import type { LoadingProps, LoadingVariant } from "./types";

export type { LoadingProps, LoadingVariant } from "./types";

const props = defineProps<LoadingProps>({
  loading: { type: Boolean, default: false },
  text: { type: String, default: "" },
  fullscreen: { type: Boolean, default: false },
  background: { type: String, default: "rgba(255,255,255,0.72)" },
  closable: { type: Boolean, default: false },
  variant: { type: String, default: "spinner" }
});

const emit = defineEmits<{
  "update:loading": [loading: boolean];
  close: [];
}>();

const close = (): void => {
  emit("update:loading", false);
  emit("close");
};

const normalizedVariant = (): LoadingVariant => {
  const variant = String(props.variant || "spinner") as LoadingVariant;
  return ["dots", "pulse", "bars"].includes(variant) ? variant : "spinner";
};

useHostAttr("fullscreen", () => (props.fullscreen ? "" : null));
useHostCssVar("--_loading-bg", () => props.background || "rgba(255,255,255,0.72)");

defineStyle(styles);

const Loading = defineHtml<LoadingProps>(html`
  <div class="loading" part="loading">
    <slot></slot>
    <div
      v-if=${props.loading}
      class="overlay"
      part="overlay"
      role="status"
      :aria-label=${props.text || "正在加载"}
    >
      <div class="box">
        <span :class=${["indicator", `is-${normalizedVariant()}`]} aria-hidden="true">
          <span v-if=${normalizedVariant() === "spinner"} class="spinner"></span>
          <span v-if=${normalizedVariant() === "dots"} class="dot"></span>
          <span v-if=${normalizedVariant() === "dots"} class="dot"></span>
          <span v-if=${normalizedVariant() === "dots"} class="dot"></span>
          <span v-if=${normalizedVariant() === "pulse"} class="pulse"></span>
          <span v-if=${normalizedVariant() === "bars"} class="bar"></span>
          <span v-if=${normalizedVariant() === "bars"} class="bar"></span>
          <span v-if=${normalizedVariant() === "bars"} class="bar"></span>
        </span>
        <span v-if=${props.text} class="loading-text">${props.text}</span>
      </div>
      <button
        v-if=${props.fullscreen && props.closable}
        class="close"
        type="button"
        aria-label="退出全屏加载"
        @click=${close}
      >
        退出全屏加载
      </button>
    </div>
  </div>
`);

export { Loading };
