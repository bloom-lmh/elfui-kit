import { defineHtml, html, useComponents } from "elfui";
import { PageEmptyProps } from "./props";
import { PageEmptyEx1 } from "./ex1";
import { PageEmptyEx2 } from "./ex2";
import { PageEmptyEx3 } from "./ex3";

useComponents({
  "page-empty-ex1": PageEmptyEx1,
  "page-empty-ex2": PageEmptyEx2,
  "page-empty-ex3": PageEmptyEx3,
  "page-empty-props": PageEmptyProps
});

const PageEmpty = defineHtml(html`
  <elf-container>
    <h1>Empty 空状态</h1>
    <p>用于列表、表格、搜索结果等空内容场景，支持默认插画、自定义图片、说明和底部操作。</p>
    <page-empty-ex1 />
    <page-empty-ex2 />
    <page-empty-ex3 />
    <page-empty-props></page-empty-props>
  </elf-container>
`);

export { PageEmpty };
