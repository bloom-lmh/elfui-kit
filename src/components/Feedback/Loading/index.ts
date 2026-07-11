import { defineHtml, defineProps, defineStyle, html, useHostAttr, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { LoadingProps } from "./types";

export type { LoadingProps } from "./types";

const props = defineProps<LoadingProps>({
  loading: { type: Boolean, default: true },
  text: { type: String, default: "" },
  fullscreen: { type: Boolean, default: false },
  background: { type: String, default: "rgba(255,255,255,0.72)" }
});

useHostAttr("fullscreen", () => (props.fullscreen ? "" : null));
useHostCssVar("--_loading-bg", () => props.background || "rgba(255,255,255,0.72)");

defineStyle(styles);

const Loading = defineHtml<LoadingProps>(html`
  <div class="loading" part="loading">
    <slot></slot>
    <div v-if=${props.loading} class="overlay" part="overlay">
      <div class="box">
        <span class="spinner" aria-hidden="true"></span>
        <span v-if=${props.text}>${props.text}</span>
      </div>
    </div>
  </div>
`);

export { Loading };
