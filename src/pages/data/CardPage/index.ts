import { defineHtml, html, useComponents } from "elfui";
import { PageCardEx1 } from "./ex1";
import { PageCardEx2 } from "./ex2";
import { PageCardEx3 } from "./ex3";
import { PageCardProps } from "./props";

useComponents({
  "page-card-ex1": PageCardEx1,
  "page-card-ex2": PageCardEx2,
  "page-card-ex3": PageCardEx3,
  "page-card-props": PageCardProps
});

const PageCard = defineHtml(html`
  <elf-container
    ><h1>Card 卡片</h1>
    <p>参考 Vuetify 的 surface 层级设计，支持变体、内容密度、封面图与底部操作区。</p>
    <page-card-ex1 /><page-card-ex2 /><page-card-ex3 /><page-card-props
  /></elf-container>
`);

export { PageCard };
