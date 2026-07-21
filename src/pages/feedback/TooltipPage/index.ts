import { defineHtml, html, useComponents } from "@elfui/core";
import { PageTooltipEx1 } from "./ex1";
import { PageTooltipEx2 } from "./ex2";
import { PageTooltipEx3 } from "./ex3";
import { PageTooltipProps } from "./props";

useComponents({
  "page-tooltip-ex1": PageTooltipEx1,
  "page-tooltip-ex2": PageTooltipEx2,
  "page-tooltip-ex3": PageTooltipEx3,
  "page-tooltip-props": PageTooltipProps
});

const PageTooltip = defineHtml(html`
  <elf-container
    ><h1>Tooltip 文字气泡提示</h1>
    <p>用于鼠标悬浮、点击、右键或聚焦时，在目标元素周围弹出的轻量级文字提示。</p>
    <page-tooltip-ex1 /><page-tooltip-ex2 /><page-tooltip-ex3 /><page-tooltip-props
  /></elf-container>
`);

export { PageTooltip };
