import { defineHtml, html, useComponents } from "elfui";
import { PageSplitterEx1 } from "./ex1";
import { PageSplitterEx2 } from "./ex2";
import { PageSplitterEx3 } from "./ex3";
import { PageSplitterProps } from "./props";

useComponents({
  "page-splitter-ex1": PageSplitterEx1,
  "page-splitter-ex2": PageSplitterEx2,
  "page-splitter-ex3": PageSplitterEx3,
  "page-splitter-props": PageSplitterProps
});

const PageSplitter = defineHtml(html`
  <elf-container>
    <h1>Splitter 分割面板</h1>
    <p>通过拖拽分隔条调整两个区域比例，支持水平、垂直、范围限制和禁用。</p>
    <page-splitter-ex1></page-splitter-ex1>
    <page-splitter-ex2></page-splitter-ex2>
    <page-splitter-ex3></page-splitter-ex3>
    <page-splitter-props></page-splitter-props>
  </elf-container>
`);

export { PageSplitter };
