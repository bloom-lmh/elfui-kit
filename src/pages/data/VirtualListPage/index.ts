import { defineHtml, html, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageVirtualListEx2 } from "./ex2";

useComponents({ "page-virtual-list-ex2": PageVirtualListEx2 });
const t = createDocsTranslator({
  title: { zh: "VirtualList 虚拟列表", en: "VirtualList" },
  description: { zh: "只渲染视口附近的项目，适用于万级固定高度数据。", en: "Render only rows near the viewport for large fixed-height data sets." },
  section: { zh: "大数据列表", en: "Large data list" },
  api: { zh: "组件 API", en: "Component API" }
});
const rows = () => [
  { name: "items", type: "unknown[]", default: "[]", desc: "列表数据 / List data" },
  { name: "item-key", type: "string | function", default: "id", desc: "稳定项目标识 / Stable item identity" },
  { name: "render-item", type: "function", default: "-", desc: "项目渲染器 / Item renderer" },
  { name: "list-item-class", type: "string", default: "''", desc: "虚拟行 class / Virtual row class" },
  { name: "list-item-style", type: "string | object", default: "''", desc: "虚拟行样式 / Virtual row style" },
  { name: "height", type: "string | number", default: "320", desc: "视口高度 / Viewport height" },
  { name: "item-height", type: "number", default: "48", desc: "固定项目高度 / Fixed item height" },
  { name: "overscan", type: "number", default: "10", desc: "视口外预渲染行数 / Overscan rows" }
];
const PageVirtualList = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <h2>${t("section")}</h2>
    <page-virtual-list-ex2></page-virtual-list-ex2>
    <h2>${t("api")}</h2>
    <elf-props-table title="VirtualList Props" :rows.prop=${rows()}></elf-props-table>
  </elf-container>
`);
export { PageVirtualList };
