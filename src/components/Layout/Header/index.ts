// elf-header — 顶栏容器
//
//   <elf-header height="56px">brand + nav</elf-header>

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { HeaderProps } from "./types";

const props = defineProps({
  height: { type: String, default: "60px" }
});

useHostCssVar("--_height", () => props.height);

defineStyle(styles);

const Header = defineHtml(html`<slot></slot>`);

export { Header };
