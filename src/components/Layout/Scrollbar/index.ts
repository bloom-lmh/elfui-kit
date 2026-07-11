import { defineEmits, defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { ScrollbarProps } from "./types";

export type { ScrollbarProps } from "./types";

const props = defineProps<ScrollbarProps>({
  height: { type: [Number, String], default: "auto" },
  maxHeight: { type: [Number, String], default: "none" },
  always: { type: Boolean, default: false },
  native: { type: Boolean, default: true }
});

const emit = defineEmits(["scroll"]);

const cssSize = (value: number | string): string =>
  typeof value === "number" ? `${Math.max(0, value)}px` : value || "auto";

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  emit("scroll", { scrollTop: target.scrollTop, scrollLeft: target.scrollLeft });
};

useHostCssVar("--_scrollbar-height", () => cssSize(props.height));
useHostCssVar("--_scrollbar-max-height", () => cssSize(props.maxHeight));

defineStyle(styles);

const Scrollbar = defineHtml<ScrollbarProps>(html`
  <div class="wrap" part="wrap" @scroll=${onScroll}>
    <div class="view" part="view"><slot></slot></div>
  </div>
`);

export { Scrollbar };
