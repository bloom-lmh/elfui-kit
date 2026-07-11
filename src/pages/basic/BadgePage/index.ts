import { defineHtml, html, useComponents } from "elfui";
import { PageBadgeEx1 } from "./ex1";
import { PageBadgeEx2 } from "./ex2";
import { PageBadgeProps } from "./props";

useComponents({
  "page-badge-ex1": PageBadgeEx1,
  "page-badge-ex2": PageBadgeEx2,
  "page-badge-props": PageBadgeProps
});

const PageBadge = defineHtml(html`
  <elf-container
    ><h1>Badge 徽章</h1>
    <p>图标或文字右上角的圆形徽章，用于通知、状态标识。</p>
    <page-badge-ex1 /><page-badge-ex2 /><page-badge-props
  /></elf-container>
`);

export { PageBadge };
