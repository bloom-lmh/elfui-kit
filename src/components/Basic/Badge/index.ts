import { defineHtml, defineProps, defineStyle, html } from "elfui";

import styles from "./style.scss?inline";
import type { BadgeProps } from "./types";

export type { BadgeProps, BadgeType } from "./types";

const props = defineProps<BadgeProps>({
  value: { type: String, default: "" },
  max: { type: Number, default: 99 },
  isDot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  type: { type: String, default: "danger" },
  showZero: { type: Boolean, default: true },
  color: { type: String, default: "" }
});

const toBadgeValue = (value: unknown): string | number => {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
};

const formatValue = (): string | number => {
  const value = toBadgeValue(props.value);
  if (value === "") return "";

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    return numericValue > Number(props.max) ? `${props.max}+` : numericValue;
  }

  return value;
};

const shouldShow = (): boolean => {
  if (props.hidden === true) return false;
  if (props.isDot === true) return true;

  const value = toBadgeValue(props.value);
  if (value === "") return false;
  if (value === "0" || value === 0) return props.showZero === true;

  return true;
};

const Badge = defineHtml<BadgeProps>(html`
  <div class="badge-wrapper" part="wrapper">
    <slot></slot>
    <sup v-if=${shouldShow()} class="badge" part="badge" :style=${props.color ? {
      backgroundColor: props.color } : {}}>
      <span v-if=${!props.isDot}>${formatValue()}</span>
    </sup>
  </div>
`);

defineStyle(styles);

export { Badge };
