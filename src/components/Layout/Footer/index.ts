// elf-footer — 底栏容器
//
//   <elf-footer height="40px">© 2026 ElfUI</elf-footer>

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { FooterProps } from "./types";

const props = defineProps({
  height: { type: String, default: "48px" }
});

useHostCssVar("--_height", () => props.height);

defineStyle(styles);

const Footer = defineHtml(html`<slot></slot>`);

export { Footer };
