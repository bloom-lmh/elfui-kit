import { defineHtml, html, useComponents } from "elfui";
import { PageTreeEx1 } from "./ex1";
import { PageTreeEx2 } from "./ex2";
import { PageTreeEx3 } from "./ex3";
import { PageTreeProps } from "./props";

useComponents({
  "page-tree-ex1": PageTreeEx1,
  "page-tree-ex2": PageTreeEx2,
  "page-tree-ex3": PageTreeEx3,
  "page-tree-props": PageTreeProps
});

const PageTree = defineHtml(html`
  <elf-container>
    <h1>Tree 树</h1>
    <p>用于展示层级数据，支持展开收起、节点选择、复选框级联、过滤和自定义字段。</p>
    <page-tree-ex1></page-tree-ex1>
    <page-tree-ex2></page-tree-ex2>
    <page-tree-ex3></page-tree-ex3>
    <page-tree-props></page-tree-props>
  </elf-container>
`);

export { PageTree };
