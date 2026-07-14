// elf-flex — flex 容器
//
// 用法：
//   <elf-flex direction="row" gap="md" justify="space-between" align="center">
//     <div>A</div><div>B</div>
//   </elf-flex>
//
// 样式见 ./style.scss；运行时通过 Vite 的 ?inline 加载为字符串注入 Shadow DOM。

import { defineHtml, defineProps, defineStyle, html, useHostAttr, useHostCssVar, useHostFlag } from "elfui";

import styles from "./style.scss?inline";
import type { FlexAlign, FlexProps, FlexSize, FlexSlots } from "./types";

export type { FlexAlign, FlexDirection, FlexGap, FlexJustify, FlexProps, FlexSize, FlexSlots } from "./types";

const gapTokens: Record<string, string> = {
  "0": "0",
  xs: "var(--elf-space-1)",
  sm: "var(--elf-space-2)",
  md: "var(--elf-space-4)",
  lg: "var(--elf-space-6)",
  xl: "var(--elf-space-8)"
};

const props = defineProps<FlexProps>({
  direction: { type: String, default: "row" },
  justify: { type: String, default: "flex-start" },
  align: { type: String, default: "stretch" },
  alignment: { type: String, default: "" },
  gap: { type: [String, Number, Array], default: "0" },
  size: { type: [String, Number, Array], default: "" },
  wrap: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  fillRatio: { type: Number, default: 100 }
});

const normalizedAlign = (): FlexAlign => props.alignment || props.align;

const toCssLength = (value: number | string): string => {
  if (typeof value === "number") return `${Math.max(0, value)}px`;
  const numeric = Number(value);
  if (value.trim() && Number.isFinite(numeric)) return `${Math.max(0, numeric)}px`;
  return gapTokens[value] || value || "0";
};

const normalizedGap = (): string => {
  const value = props.size === "" ? props.gap : props.size;
  if (Array.isArray(value)) {
    const [horizontal = 0, vertical = horizontal] = value;
    return `${Math.max(0, vertical)}px ${Math.max(0, horizontal)}px`;
  }
  return toCssLength(value);
};

const normalizedFillRatio = (): string => `${Math.min(100, Math.max(0, Number(props.fillRatio) || 0))}%`;

useHostAttr("direction", () => props.direction);
useHostAttr("justify", () => props.justify);
useHostAttr("align", normalizedAlign);
useHostFlag("wrap", () => props.wrap);
useHostFlag("inline", () => props.inline);
useHostFlag("fill", () => props.fill);
useHostCssVar("--_gap", normalizedGap);
useHostCssVar("--_fill-ratio", normalizedFillRatio);

defineStyle(styles);

const Flex = defineHtml<FlexProps, Record<string, never>, FlexSlots>(html`<slot></slot>`);

export { Flex };
