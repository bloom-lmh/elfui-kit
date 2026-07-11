import { defineHtml, html, useComponents } from "elfui";
import { PageTourEx1 } from "./ex1";
import { PageTourEx2 } from "./ex2";
import { PageTourProps } from "./props";

useComponents({
  "page-tour-ex1": PageTourEx1,
  "page-tour-ex2": PageTourEx2,
  "page-tour-props": PageTourProps
});

const PageTour = defineHtml(html`
  <elf-container>
    <h1>Tour 漫游式引导</h1>
    <p>分步骤引导用户了解页面功能，支持高亮遮罩、步骤定位、键盘导航和焦点管理。</p>
    <page-tour-ex1 />
    <page-tour-ex2 />
    <page-tour-props />
  </elf-container>
`);

export { PageTour };
