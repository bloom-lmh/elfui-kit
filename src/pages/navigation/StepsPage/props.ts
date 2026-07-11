import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "active", type: "number", default: "0", desc: "当前激活步骤索引，从 0 开始" },
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: "步骤条方向" },
  { name: "items", type: "StepItem[]", default: "[]", desc: "步骤数据" },
  { name: "space", type: "string | number", default: "-", desc: "每个步骤的间距，数字会转为 px" },
  { name: "processStatus", type: "StepStatus", default: "process", desc: "当前步骤状态" },
  { name: "finishStatus", type: "StepStatus", default: "finish", desc: "已完成步骤状态" },
  { name: "alignCenter", type: "boolean", default: "false", desc: "水平步骤居中对齐" },
  { name: "simple", type: "boolean", default: "false", desc: "简洁模式" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "图标尺寸" },
  { name: "clickable", type: "boolean", default: "true", desc: "是否允许点击步骤切换" },
  { name: "alternativeLabel", type: "boolean", default: "false", desc: "水平居中标签布局" }
];

const itemRows = [
  { name: "title", type: "string", default: "-", desc: "标题" },
  { name: "description", type: "string", default: "-", desc: "描述" },
  { name: "icon", type: "string", default: "-", desc: "自定义图标文本" },
  { name: "status", type: "wait | process | finish | error", default: "-", desc: "显式状态" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁止点击该步骤" },
  { name: "value", type: "string | number", default: "-", desc: "稳定 key" }
];

const eventsRows = [
  { name: "update:active", type: "(active: number) => void", desc: "请求更新当前步骤" },
  {
    name: "change",
    type: "(detail: { active: number; item: StepItem }) => void",
    desc: "步骤切换"
  }
];

const methodsRows = [
  { name: "next()", type: "() => void", desc: "请求切到下一步" },
  { name: "prev()", type: "() => void", desc: "请求切到上一步" },
  { name: "setActive(index)", type: "(index: number) => void", desc: "请求切到指定步骤" }
];

const PageStepsProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="StepItem" :rows=${itemRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageStepsProps };
