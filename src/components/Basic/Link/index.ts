import { defineHtml, defineProps, defineStyle, html, useHostAttr, useHostFlag } from "elfui";

import styles from "./style.scss?inline";
import type { LinkProps, LinkSlots, LinkType } from "./types";

export type { LinkProps, LinkSlots, LinkType } from "./types";

const props = defineProps<LinkProps>({
  type: { type: String, default: "default" },
  underline: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: "" },
  target: { type: String, default: "" },
  icon: { type: String, default: "" }
});

const normalizedType = (): LinkType => {
  const value = String(props.type || "default") as LinkType;
  return ["primary", "success", "warning", "danger", "info"].includes(value) ? value : "default";
};

const onClick = (event: Event): void => {
  if (!props.disabled) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
};

useHostAttr("type", normalizedType);
useHostFlag("underline", () => Boolean(props.underline));
useHostFlag("disabled", () => Boolean(props.disabled));

defineStyle(styles);

const Link = defineHtml<LinkProps, Record<string, never>, LinkSlots>(html`
  <a
    class="link"
    part="link"
    :href=${props.disabled ? null : props.href || null}
    :target=${props.disabled ? null : props.target || null}
    :aria-disabled=${props.disabled ? "true" : null}
    @click=${onClick}
  >
    <span class="icon"><slot name="icon"><span v-if=${props.icon} class="prop-icon" aria-hidden="true">${props.icon}</span></slot></span>
    <slot></slot>
  </a>
`);

export { Link };
