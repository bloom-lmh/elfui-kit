import { defineHtml, html } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "List 列表", en: "List" },
  description: { zh: "以一致的结构展示连续信息，支持数据渲染与声明式 ListItem。", en: "Display continuous information with data renderers or declarative ListItem children." },
  section: { zh: "声明式列表项", en: "Declarative list items" },
  example: { zh: "标题、副标题与插槽", en: "Title, subtitle, and slots" },
  first: { zh: "设计评审", en: "Design review" },
  firstSub: { zh: "今天 10:30 · 产品会议室", en: "Today 10:30 · Product room" },
  second: { zh: "回归测试", en: "Regression testing" },
  secondSub: { zh: "12 个组件等待验证", en: "12 components awaiting verification" },
  open: { zh: "打开", en: "Open" },
  api: { zh: "组件 API", en: "Component API" }
});

const code = `<elf-list bordered>
  <elf-list-item title="设计评审" subtitle="今天 10:30 · 产品会议室" clickable value="review">
    <elf-avatar slot="leading">DR</elf-avatar>
    <span slot="trailing">打开</span>
  </elf-list-item>
  <elf-list-item title="回归测试" subtitle="12 个组件等待验证">
    <elf-avatar slot="leading">QA</elf-avatar>
  </elf-list-item>
</elf-list>`;
const listRows = () => [
  { name: "items", type: "unknown[]", default: "[]", desc: "数据驱动列表项 / Data-driven items" },
  { name: "item-key", type: "string | function", default: "id", desc: "稳定项目标识 / Stable item identity" },
  { name: "render-item", type: "function", default: "-", desc: "自定义数据项渲染 / Custom item renderer" },
  { name: "bordered / divided", type: "boolean", default: "false / true", desc: "边框和分隔线 / Border and dividers" }
];
const itemRows = () => [
  { name: "title / subtitle", type: "string", default: "''", desc: "主副文本 / Primary and secondary text" },
  { name: "lines", type: "one | two | three", default: "two", desc: "文本行模式 / Text line mode" },
  { name: "clickable / active / disabled", type: "boolean", default: "false", desc: "交互状态 / Interaction states" },
  { name: "leading / default / trailing", type: "slot", default: "-", desc: "列表项内容插槽 / Content slots" }
];

const PageList = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <h2>${t("section")}</h2>
    <elf-playground :title=${t("example")} :code=${code}>
      <elf-list bordered style="width:100%;max-width:680px">
        <elf-list-item :title=${t("first")} :subtitle=${t("firstSub")} clickable value="review">
          <elf-avatar slot="leading" size="36">DR</elf-avatar>
          <span slot="trailing">${t("open")}</span>
        </elf-list-item>
        <elf-list-item :title=${t("second")} :subtitle=${t("secondSub")}>
          <elf-avatar slot="leading" size="36">QA</elf-avatar>
        </elf-list-item>
      </elf-list>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table title="List Props" :rows.prop=${listRows()}></elf-props-table>
    <elf-props-table title="ListItem Props & Slots" :rows.prop=${itemRows()}></elf-props-table>
  </elf-container>
`);

export { PageList };
