import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { EmptyProps, EmptySlots } from "./types";

export type { EmptyProps, EmptySlots } from "./types";

const props = defineProps<EmptyProps>({
  image: { type: String, default: "" },
  imageSize: { type: [Number, String], default: 160 },
  description: { type: String, default: "No data" }
});

const imageSize = (): string => {
  const value = props.imageSize;
  if (typeof value === "number") return `${Math.max(40, value)}px`;
  return value || "160px";
};

useHostCssVar("--_empty-image-size", imageSize);

defineStyle(styles);

const Empty = defineHtml<EmptyProps, Record<string, never>, EmptySlots>(html`
  <div class="empty" part="empty">
    <div class="image" part="image">
      <slot name="image">
        <img v-if=${props.image} :src=${props.image} alt="" />
        <div v-else class="placeholder" aria-hidden="true">--</div>
      </slot>
    </div>
    <div class="description" part="description">
      <slot name="description">${props.description}</slot>
    </div>
    <div class="bottom" part="bottom">
      <slot></slot>
    </div>
  </div>
`);

export { Empty };
