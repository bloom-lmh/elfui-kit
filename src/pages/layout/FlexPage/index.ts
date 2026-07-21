import { defineHtml, html, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageFlexEx1 } from "./ex1";
import { PageFlexEx2 } from "./ex2";
import { PageFlexEx3 } from "./ex3";
import { PageFlexEx4 } from "./ex4";
import { PageFlexProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Flex 弹性布局", en: "Flex layout" },
  description: {
    zh: "用于一维方向、对齐、换行和自适应空间分配；虚线框只表达布局关系，不混入装饰内容。",
    en: "Control direction, alignment, wrapping, and adaptive space distribution through plain dashed layout guides."
  }
});

useComponents({
  "page-flex-ex1": PageFlexEx1,
  "page-flex-ex2": PageFlexEx2,
  "page-flex-ex3": PageFlexEx3,
  "page-flex-ex4": PageFlexEx4,
  "page-flex-props": PageFlexProps
});

const PageFlex = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-flex-ex1 />
    <page-flex-ex2 />
    <page-flex-ex3 />
    <page-flex-ex4 />
    <page-flex-props />
  </elf-container>
`);

export { PageFlex };
