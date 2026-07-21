import { defineHtml, html, useComponents } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import { PageGridEx1 } from "./ex1";
import { PageGridEx2 } from "./ex2";
import { PageGridEx3 } from "./ex3";
import { PageGridEx4 } from "./ex4";
import { PageGridProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Grid 栅格布局", en: "Grid layout" },
  description: {
    zh: "基于原生 CSS Grid 的 12 列栅格系统，以纯虚线框展示列宽、偏移与响应式关系。",
    en: "A 12-column CSS Grid system shown with plain dashed guides for spans, offsets, and responsive behavior."
  }
});

useComponents({
  "page-grid-ex1": PageGridEx1,
  "page-grid-ex2": PageGridEx2,
  "page-grid-ex3": PageGridEx3,
  "page-grid-ex4": PageGridEx4,
  "page-grid-props": PageGridProps
});

const PageGrid = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-grid-ex1 />
    <page-grid-ex2 />
    <page-grid-ex3 />
    <page-grid-ex4 />
    <page-grid-props />
  </elf-container>
`);

export { PageGrid };
