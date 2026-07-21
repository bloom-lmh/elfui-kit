import { defineHtml, defineProps, defineStyle, html, useHostAttr } from "@elfui/core";

import styles from "./style.scss?inline";
import type { MenuItemGroupProps, MenuItemGroupSlots } from "../Menu/types";

export type { MenuItemGroupProps, MenuItemGroupSlots } from "../Menu/types";

defineProps<MenuItemGroupProps>({
  title: { type: String, default: "" }
});

useHostAttr("role", () => "none");

defineStyle(styles);

const MenuItemGroup = defineHtml<MenuItemGroupProps, Record<string, never>, MenuItemGroupSlots>(html`
  <slot name="title"></slot>
  <slot></slot>
`);

export { MenuItemGroup };
