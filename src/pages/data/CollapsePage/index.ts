import { defineHtml, html, useComponents } from "elfui";
import { PageCollapseProps } from "./props";
import { PageCollapseEx1 } from "./ex1";
import { PageCollapseEx2 } from "./ex2";
import { PageCollapseEx3 } from "./ex3";
import { PageCollapseEx4 } from "./ex4";

useComponents({
  "page-collapse-ex1": PageCollapseEx1,
  "page-collapse-ex2": PageCollapseEx2,
  "page-collapse-ex3": PageCollapseEx3,
  "page-collapse-ex4": PageCollapseEx4,
  "page-collapse-props": PageCollapseProps
});

const PageCollapse = defineHtml(html`
  <elf-container>
    <h1>Collapse 折叠面板</h1>
    <p>用于分组展示内容，支持多开、手风琴模式、禁用项、字段映射和组合式子面板。</p>

    <page-collapse-ex1 />

    <page-collapse-ex2 />

    <page-collapse-ex3 />

    <page-collapse-ex4 />

    <page-collapse-props></page-collapse-props>
  </elf-container>
`);

export { PageCollapse };
