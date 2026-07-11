// elf-container — 居中限宽容器（Material 风格）
//
// 用法：
//   <elf-container max-width="md">...</elf-container>

import { defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";
export type { ContainerMaxWidth, ContainerPadding, ContainerProps } from "./types";

const props = defineProps({
  maxWidth: { type: String, default: "lg" },
  padding: { type: String, default: "md" }
});

defineStyle(styles);

const Container = defineHtml(html`<slot></slot>`);

export { Container };
