import { defineHtml, html, useComponents } from "elfui";
import { PageTabsEx1 } from "./ex1";
import { PageTabsEx2 } from "./ex2";
import { PageTabsEx3 } from "./ex3";
import { PageTabsEx4 } from "./ex4";
import { PageTabsEx5 } from "./ex5";
import { PageTabsEx6 } from "./ex6";
import { PageTabsProps } from "./props";

useComponents({
  "page-tabs-ex1": PageTabsEx1,
  "page-tabs-ex2": PageTabsEx2,
  "page-tabs-ex3": PageTabsEx3,
  "page-tabs-ex4": PageTabsEx4,
  "page-tabs-ex5": PageTabsEx5,
  "page-tabs-ex6": PageTabsEx6,
  "page-tabs-props": PageTabsProps
});

const PageTabs = defineHtml(html`
  <elf-container>
    <h1>Tabs 标签页</h1>
    <p>
      用于同一层级内容切换，API 对标 Vuetify v-tabs，支持 grow、stacked、vertical 和内置 panel。
    </p>
    <page-tabs-ex1></page-tabs-ex1>
    <page-tabs-ex2></page-tabs-ex2>
    <page-tabs-ex5></page-tabs-ex5>
    <page-tabs-ex6></page-tabs-ex6>
    <page-tabs-ex3></page-tabs-ex3>
    <page-tabs-ex4></page-tabs-ex4>
    <page-tabs-props></page-tabs-props>
  </elf-container>
`);

export { PageTabs };
