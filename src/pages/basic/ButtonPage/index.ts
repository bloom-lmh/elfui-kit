import { defineHtml, html, useComponents } from "@elfui/core";
import { PageButtonEx1 } from "./ex1";
import { PageButtonEx2 } from "./ex2";
import { PageButtonEx3 } from "./ex3";
import { PageButtonProps } from "./props";

useComponents({
  "page-button-ex1": PageButtonEx1,
  "page-button-ex2": PageButtonEx2,
  "page-button-ex3": PageButtonEx3,
  "page-button-props": PageButtonProps
});

const PageButton = defineHtml(html`
  <elf-container
    ><h1>Button 按钮</h1>
    <p>Material Design 风格按钮。3 variant × 6 color × 3 size × 4 shape。</p>
    <page-button-ex1 /><page-button-ex2 /><page-button-ex3 /><page-button-props
  /></elf-container>
`);

export { PageButton };
