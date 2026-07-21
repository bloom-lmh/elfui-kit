import { defineHtml, html, useComponents } from "elfui";
import { createDocsTranslator } from "../../docsLocale";
import { PageVirtualListEx1 } from "./ex1";
import { PageVirtualListEx2 } from "./ex2";

useComponents({ "page-virtual-list-ex1": PageVirtualListEx1, "page-virtual-list-ex2": PageVirtualListEx2 });
const t = createDocsTranslator({
  title: { zh: "List 与 VirtualList", en: "List and VirtualList" },
  description: { zh: "普通列表与固定行高虚拟列表共享渲染契约；虚拟列表适合万级数据。", en: "List and fixed-height VirtualList share the same rendering contract; VirtualList is suitable for tens of thousands of rows." },
  data: { zh: "列表数据", en: "List data" }, stable: { zh: "稳定项目标识", en: "Stable item identity" },
  renderer: { zh: "项目渲染器", en: "Item renderer" }, viewport: { zh: "VirtualList 视口高度", en: "VirtualList viewport height" },
  itemHeight: { zh: "VirtualList 固定项目高度", en: "VirtualList fixed row height" }, overscan: { zh: "视口前后额外渲染数量", en: "Extra rows rendered around the viewport" },
  borders: { zh: "边框与分隔线", en: "Border and dividers" }, empty: { zh: "空状态文案", en: "Empty-state text" },
  emptyDefault: { zh: "暂无数据", en: "No data" }
});
const propsRows = () => [
  { name: "items", type: "unknown[]", default: "[]", desc: t("data") },
  { name: "item-key", type: "string | function", default: "id", desc: t("stable") },
  { name: "render-item", type: "(item, index) => Node | primitive", default: "-", desc: t("renderer") },
  { name: "height", type: "string | number", default: "320", desc: t("viewport") },
  { name: "item-height", type: "number", default: "48", desc: t("itemHeight") },
  { name: "overscan", type: "number", default: "10", desc: t("overscan") },
  { name: "bordered / divided", type: "boolean", default: "false / true", desc: t("borders") },
  { name: "empty-text", type: "string", default: t("emptyDefault"), desc: t("empty") }
];
const PageVirtualList = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-virtual-list-ex1></page-virtual-list-ex1>
    <page-virtual-list-ex2></page-virtual-list-ex2>
    <h2>API</h2>
    <elf-props-table title="List / VirtualList Props" :rows.prop=${propsRows()}></elf-props-table>
  </elf-container>
`);
export { PageVirtualList };
