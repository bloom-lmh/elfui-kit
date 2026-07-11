// elf-button — Material Design + Element Plus 风格按钮
//
// 用法：
//   <elf-button variant="contained" color="primary" size="md">提交</elf-button>
//   <elf-button shape="circle" size="lg"><span slot="icon">★</span></elf-button>
//   <elf-button variant="contained" plain color="success">plain</elf-button>
//   <elf-button shape="round" loading>loading</elf-button>

import { defineEmits, defineHtml, defineProps, defineStyle, html } from "elfui";

import styles from "./style.scss?inline";
import type { ButtonEmits, ButtonProps, ButtonSlots } from "./types";

export type {
  ButtonColor,
  ButtonEmits,
  ButtonProps,
  ButtonShape,
  ButtonSize,
  ButtonSlots,
  ButtonType,
  ButtonVariant
} from "./types";

const props = defineProps<ButtonProps>({
  variant: { type: String, default: "contained" },
  color: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  shape: { type: String, default: "default" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  dashed: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  type: { type: String, default: "button" },
  form: { type: String, default: "" }
});

defineEmits<ButtonEmits>();
defineStyle(styles);

const handleClick = (event: Event): void => {
  if (!props.disabled && !props.loading) return;
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.preventDefault();
};

const Button = defineHtml<ButtonProps, ButtonEmits, ButtonSlots>(html`
  <button part="button" :type=${props.type} :disabled=${props.disabled ||
    props.loading} :aria-busy=${props.loading} :autofocus=${props.autofocus}
    :form=${props.form || null} @click=${handleClick}>
    <span v-if=${props.loading} class="spinner" aria-hidden="true"></span>
    <slot v-if=${!props.loading} name="icon"></slot>
    <slot></slot>
    <slot name="suffix-icon"></slot>
  </button>
`);

export { Button };
