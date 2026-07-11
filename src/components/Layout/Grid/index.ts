// elf-grid - 12 列栅格容器

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { GridGap, GridItemProps, GridProps } from "./types";

const props = defineProps({
  columns: { type: Number, default: 12 },
  gap: { type: String, default: "0" }
});

useHostCssVar("--_cols", () => props.columns);

defineStyle(styles);

const Grid = defineHtml(html`<slot></slot>`);

export { Grid };
