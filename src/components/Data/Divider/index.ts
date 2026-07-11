// elf-divider — 分割线
//
//   <elf-divider></elf-divider>
//   <elf-divider dashed>OR</elf-divider>
//   <elf-divider direction="vertical"></elf-divider>

import { defineProps, defineStyle, html, useRef, defineHtml } from "elfui";

import styles from "./style.scss?inline";

export type { DividerContentPosition, DividerDirection, DividerProps } from "./types";

defineProps({
  direction: { type: String, default: "horizontal" },
  contentPosition: { type: String, default: "center" },
  dashed: { type: Boolean, default: false }
});

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
