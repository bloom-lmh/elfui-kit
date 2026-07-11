// elf-grid-item - grid child item

import { defineProps, defineStyle, html, useHostCssVar, defineHtml } from "elfui";

import itemStyles from "../Grid/item.scss?inline";
import type { GridItemProps } from "../Grid/types";

export type { GridItemProps };

const props = defineProps({
  span: { type: Number, default: 1 }
}) as unknown as Readonly<GridItemProps>;

useHostCssVar("--_span", () => props.span);

defineStyle(itemStyles);

const GridItem = defineHtml(html`<slot></slot>`);

export { GridItem };
