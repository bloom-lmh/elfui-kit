import { defineHtml, defineProps, defineStyle, html, useHostCssVar, useRef } from "elfui";

import styles from "./style.scss?inline";
import type { ImageFit, ImageProps } from "./types";

export type { ImageFit, ImageProps } from "./types";

const props = defineProps<ImageProps>({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  fit: { type: String, default: "fill" },
  width: { type: [Number, String], default: "auto" },
  height: { type: [Number, String], default: "auto" },
  lazy: { type: Boolean, default: false }
});

const error = useRef(false);

const cssSize = (value: number | string): string =>
  typeof value === "number" ? `${Math.max(0, value)}px` : value || "auto";

const fit = (): ImageFit => {
  const value = String(props.fit || "fill") as ImageFit;
  return ["contain", "cover", "none", "scale-down"].includes(value) ? value : "fill";
};

const onError = (): void => {
  error.set(true);
};

useHostCssVar("--_image-width", () => cssSize(props.width));
useHostCssVar("--_image-height", () => cssSize(props.height));
useHostCssVar("--_image-fit", fit);

defineStyle(styles);

const Image = defineHtml<ImageProps>(html`
  <div class="image" part="image">
    <slot v-if=${error.value} name="error">
      <div class="error">Load failed</div>
    </slot>
    <img
      v-else
      part="img"
      :src=${props.src}
      :alt=${props.alt}
      :loading=${props.lazy ? "lazy" : null}
      @error=${onError}
    />
  </div>
`);

export { Image };
