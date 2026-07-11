import { defineHtml, html, useComponents } from "elfui";
import { PageCardEx1 } from "./ex1";
import { PageCardEx2 } from "./ex2";
import { PageCardProps } from "./props";

useComponents({
  "page-card-ex1": PageCardEx1,
  "page-card-ex2": PageCardEx2,
  "page-card-props": PageCardProps
});

const PageCard = defineHtml(html`
  <elf-container
    ><h1>Card 卡片</h1>
    <p>Material Design 风格卡片。支持封面图、标题、内容、底部操作栏。</p>
    <page-card-ex1 /><page-card-ex2 /><page-card-props
  /></elf-container>
`);

export { PageCard };
