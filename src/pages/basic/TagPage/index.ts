import { defineHtml, html, useComponents } from "@elfui/core";
import { PageTagEx1 } from "./ex1";
import { PageTagEx2 } from "./ex2";
import { PageTagProps } from "./props";

useComponents({
  "page-tag-ex1": PageTagEx1,
  "page-tag-ex2": PageTagEx2,
  "page-tag-props": PageTagProps
});

const PageTag = defineHtml(html`
  <elf-container
    ><h1>Tag 标签</h1>
    <p>展示状态、分类等信息的小标签。</p>
    <page-tag-ex1 /><page-tag-ex2 /><page-tag-props
  /></elf-container>
`);

export { PageTag };
