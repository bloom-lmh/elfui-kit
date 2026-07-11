import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { IconProps, IconSlots } from "./types";

export type { IconProps, IconSlots } from "./types";

const props = defineProps<IconProps>({
  name: { type: String, default: "" },
  size: { type: [Number, String], default: "1em" },
  color: { type: String, default: "" }
});

const size = (): string => {
  const value = props.size;
  return typeof value === "number" ? `${Math.max(1, value)}px` : value || "1em";
};

useHostCssVar("--_icon-size", size);
useHostCssVar("--_icon-color", () => props.color || "currentColor");

defineStyle(styles);

const Icon = defineHtml<IconProps, Record<string, never>, IconSlots>(html`
  <span class="icon" part="icon" aria-hidden="true">
    <slot>${props.name}</slot>
  </span>
`);

export { Icon };
