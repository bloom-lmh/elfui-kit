// elf-tag — 标签
//
//   <elf-tag>默认</elf-tag>
//   <elf-tag color="success" closable @close="onClose">已完成</elf-tag>

import { defineEmits, defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { TagProps } from "./types";

export type { TagColor, TagProps, TagSize, TagVariant } from "./types";

const props = defineProps({
  color: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  variant: { type: String, default: "light" },
  closable: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
}) as unknown as Readonly<TagProps>;

const emit = defineEmits(["close", "click"]);

const onClose = (e: Event): void => {
  e.stopPropagation();
  emit("close", e);
};

defineStyle(styles);

const Tag = defineHtml(html`
  <span class="tag" part="tag">
    <slot></slot>
    <button v-if=${props.closable && !props.disabled} class="close"
      @click=${onClose} aria-label="关闭" type="button">
      x
    </button>
  </span>
`);

export { Tag };
