// elf-flex — flex 容器
//
// 用法：
//   <elf-flex direction="row" gap="md" justify="space-between" align="center">
//     <div>A</div><div>B</div>
//   </elf-flex>
//
// 样式见 ./style.scss；运行时通过 Vite 的 ?inline 加载为字符串注入 Shadow DOM。

import { defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";
export type { FlexAlign, FlexDirection, FlexGap, FlexJustify, FlexProps } from "./types";

const props = defineProps({
  direction: { type: String, default: "row" },
  justify: { type: String, default: "flex-start" },
  align: { type: String, default: "stretch" },
  gap: { type: String, default: "0" },
  wrap: { type: Boolean, default: false }
});

defineStyle(styles);

const Flex = defineHtml(html`<slot></slot>`);

export { Flex };
