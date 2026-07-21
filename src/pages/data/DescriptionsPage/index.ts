import { defineHtml, html, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageDescriptionsProps } from "./props";
import { PageDescriptionsEx1 } from "./ex1";
import { PageDescriptionsEx2 } from "./ex2";
import { PageDescriptionsEx3 } from "./ex3";

useComponents({
  "page-descriptions-ex1": PageDescriptionsEx1,
  "page-descriptions-ex2": PageDescriptionsEx2,
  "page-descriptions-ex3": PageDescriptionsEx3,
  "page-descriptions-props": PageDescriptionsProps
});

const t = createDocsTranslator({
  title: { zh: "Descriptions 描述列表", en: "Descriptions" },
  description: {
    zh: "成组展示键值信息，支持列数、边框、方向、尺寸和字段跨列。",
    en: "Present grouped key-value details with columns, borders, directions, sizes, and spans."
  }
});

const PageDescriptions = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-descriptions-ex1 />
    <page-descriptions-ex2 />
    <page-descriptions-ex3 />
    <page-descriptions-props />
  </elf-container>
`);

export { PageDescriptions };
