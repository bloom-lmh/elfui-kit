// elf-grid - 12 列栅格容器

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { GridGap, GridItemProps, GridProps } from "./types";

const props = defineProps({
  columns: { type: Number, default: 12 },
  gap: { type: String, default: "0" },
  autoFit: { type: Boolean, default: false },
  minColumnWidth: { type: String, default: "220px" }
});

useHostCssVar("--_cols", () => Math.max(1, Number(props.columns) || 12));
useHostCssVar("--_min-col", () => String(props.minColumnWidth || "220px"));

defineStyle(styles);

const Grid = defineHtml(html`<slot></slot>`);

export { Grid };
