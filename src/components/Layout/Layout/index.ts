// elf-layout — 容器组件，按方向（vertical/horizontal）排列子区
//
// 与 elf-header / elf-aside / elf-main / elf-footer 配合：
//   <elf-layout>
//     <elf-header>顶部</elf-header>
//     <elf-layout direction="horizontal">
//       <elf-aside>侧边</elf-aside>
//       <elf-main>主内容</elf-main>
//     </elf-layout>
//     <elf-footer>底部</elf-footer>
//   </elf-layout>
//
// 默认 column 方向；含侧栏时手动指定 direction="horizontal"

import { defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { LayoutDirection, LayoutProps } from "./types";

const props = defineProps({
  direction: { type: String, default: "vertical" }
});

defineStyle(styles);

const Layout = defineHtml(html`<slot></slot>`);

export { Layout };
