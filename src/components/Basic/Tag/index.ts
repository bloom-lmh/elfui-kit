import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  useHost,
  useHostAttr,
  useHostFlag
} from "elfui";

import styles from "./style.scss?inline";
import type { TagColor, TagEmits, TagProps, TagVariant } from "./types";

export type { TagColor, TagEffect, TagEmits, TagProps, TagSize, TagVariant } from "./types";

const props = defineProps({
  type: { type: String, default: "" },
  color: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  variant: { type: String, default: "light" },
  effect: { type: String, default: "" },
  closable: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  disableTransitions: { type: Boolean, default: false },
  hit: { type: Boolean, default: false },
  checked: { type: Boolean, default: undefined }
}) as unknown as Readonly<TagProps>;

const emit = defineEmits<TagEmits>();
const host = useHost();

const colors = ["primary", "secondary", "success", "warning", "danger", "info"];

const normalizedColor = (): TagColor => {
  const type = String(props.type || "");
  if (colors.includes(type)) return type as TagColor;
  return colors.includes(String(props.color)) ? props.color : "primary";
};

const normalizedVariant = (): TagVariant => {
  if (props.effect === "dark") return "filled";
  if (props.effect === "plain") return "outlined";
  return props.variant === "filled" || props.variant === "outlined" ? props.variant : "light";
};

const isCheckable = (): boolean => host.hasAttribute("checked") || typeof props.checked === "boolean";
const isChecked = (): boolean => props.checked === true || host.hasAttribute("checked");

const onClose = (event: Event): void => {
  event.stopPropagation();
  emit("close", event);
};

const onClick = (event: MouseEvent): void => {
  if (props.disabled) return;
  emit("click", event);
  if (!isCheckable()) return;
  const next = !isChecked();
  emit("update:checked", next);
  emit("change", next);
};

useHostAttr("color", normalizedColor);
useHostAttr("variant", normalizedVariant);
useHostFlag("disable-transitions", () => Boolean(props.disableTransitions));
useHostFlag("hit", () => Boolean(props.hit));
useHostFlag("checked", isChecked);

defineStyle(styles);

const Tag = defineHtml<TagProps, TagEmits>(html`
  <span class="tag" part="tag" :aria-pressed=${isCheckable() ? String(isChecked()) : null} @click=${onClick}>
    <slot></slot>
    <button
      v-if=${props.closable && !props.disabled}
      class="close"
      @click=${onClose}
      aria-label="Close"
      type="button"
    >
      x
    </button>
  </span>
`);

export { Tag };
