// elf-aside — 侧边栏容器
//
//   <elf-aside width="220px">导航</elf-aside>

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { AsideProps } from "./types";

const props = defineProps({
  width: { type: String, default: "240px" }
});

useHostCssVar("--_width", () => props.width);

defineStyle(styles);

const Aside = defineHtml(html`<slot></slot>`);

export { Aside };
