import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "@elfui/core";

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
        <svg v-else class="illustration" viewBox="0 0 160 160" aria-hidden="true">
          <path class="cloud cloud-left" d="M18 103c0-10 8-18 18-18 3-12 13-20 26-20 14 0 25 10 27 23 9 1 16 8 16 18 0 10-8 18-18 18H36c-10 0-18-9-18-21Z" />
          <path class="cloud cloud-right" d="M83 71c0-8 7-15 15-15 3-10 12-17 23-17 12 0 22 8 24 19 8 0 15 7 15 15 0 9-7 16-16 16H99c-9 0-16-8-16-18Z" />
          <path class="box" d="M43 84 80 65l37 19v43l-37 20-37-20V84Z" />
          <path class="box-top" d="m43 84 37 20 37-20M80 104v43" />
          <circle class="spark" cx="121" cy="45" r="5" />
          <circle class="spark small" cx="35" cy="48" r="3" />
        </svg>
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
