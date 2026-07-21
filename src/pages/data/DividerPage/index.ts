import { defineHtml, html, useComponents } from "@elfui/core";
import { PageDividerEx1 } from "./ex1";
import { PageDividerEx2 } from "./ex2";
import { PageDividerProps } from "./props";

useComponents({
  "page-divider-ex1": PageDividerEx1,
  "page-divider-ex2": PageDividerEx2,
  "page-divider-props": PageDividerProps
});

const PageDivider = defineHtml(html`
  <elf-container
    ><h1>Divider 分割线</h1>
    <p>区隔内容的分割线。支持水平/垂直、虚线、带文字。</p>
    <page-divider-ex1 /><page-divider-ex2 /><page-divider-props
  /></elf-container>
`);

export { PageDivider };
