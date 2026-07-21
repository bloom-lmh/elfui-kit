// elf-divider — 分割线
//
//   <elf-divider></elf-divider>
//   <elf-divider dashed>OR</elf-divider>
//   <elf-divider direction="vertical"></elf-divider>

import { defineProps, defineStyle, html, useHostAttr, useHostCssVar, useRef, defineHtml } from "@elfui/core";

import styles from "./style.scss?inline";

import type { DividerBorderStyle, DividerProps } from "./types";

export type { DividerBorderStyle, DividerContentPosition, DividerDirection, DividerProps } from "./types";

const props = defineProps({
  direction: { type: String, default: "horizontal" },
  contentPosition: { type: String, default: "center" },
  borderStyle: { type: String, default: "solid" },
  // Kept as a compatibility alias for the original ElfUI Kit API.
  dashed: { type: Boolean, default: false }
}) as unknown as Readonly<DividerProps>;

const borderStyles = new Set<DividerBorderStyle>(["solid", "dashed", "dotted", "double"]);

const normalizedBorderStyle = (): DividerBorderStyle => {
  if (props.dashed) return "dashed";
  const style = String(props.borderStyle || "solid") as DividerBorderStyle;
  return borderStyles.has(style) ? style : "solid";
};

useHostAttr("border-style", normalizedBorderStyle);
useHostCssVar("--_divider-border-style", normalizedBorderStyle);

const hasContent = useRef(false);

const onSlotChange = (e: Event): void => {
  const slot = e.target as HTMLSlotElement;
  const nodes = slot.assignedNodes();
  hasContent.set(nodes.some((n) => (n.textContent?.trim() ?? "") !== ""));
};

defineStyle(styles);

const Divider = defineHtml(html`
  <span class="line line-left"></span>
  <span class="text" v-show=${hasContent}><slot @slotchange=${onSlotChange}></slot></span>
  <span class="line line-right"></span>
`);

export { Divider };
