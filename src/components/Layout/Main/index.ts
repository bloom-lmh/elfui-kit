// elf-main — 主内容容器（占据剩余空间）

import { defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { MainProps } from "./types";

defineStyle(styles);

const Main = defineHtml(html`<slot></slot>`);

export { Main };
