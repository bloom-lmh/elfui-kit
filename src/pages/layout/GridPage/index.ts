import { defineHtml, html, useComponents } from "elfui";
import { PageGridEx1 } from "./ex1";
import { PageGridEx2 } from "./ex2";
import { PageGridEx3 } from "./ex3";
import { PageGridProps } from "./props";

useComponents({
  "page-grid-ex1": PageGridEx1,
  "page-grid-ex2": PageGridEx2,
  "page-grid-ex3": PageGridEx3,
  "page-grid-props": PageGridProps
});

const PageGrid = defineHtml(html`
  <elf-container
    ><h1>Grid 栅格</h1>
    <p>基于原生 CSS Grid 的 12 列栅格系统。</p>
    <page-grid-ex1 /><page-grid-ex2 /><page-grid-ex3 /><page-grid-props
  /></elf-container>
`);

export { PageGrid };
