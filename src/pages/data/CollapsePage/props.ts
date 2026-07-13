import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "model-value", type: "string | string[]", default: "''", desc: "当前展开项；accordion 时为单个 name" },
  { name: "accordion", type: "boolean", default: "false", desc: "是否一次只展开一个面板" },
  { name: "items", type: "CollapseItem[]", default: "[]", desc: "面板数据" },
  { name: "props", type: "CollapseFieldNames", default: "默认字段映射", desc: "name/title/content/disabled 字段名称" }
];

const eventsRows = [
  { name: "update:modelValue", type: "string | string[]", desc: "展开项变化" },
  { name: "change", type: "string | string[]", desc: "展开项变化" }
];

const itemRows = [
  { name: "name", type: "string", desc: "面板唯一标识" },
  { name: "title", type: "string", desc: "标题" },
  { name: "content", type: "string", desc: "内容" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁止切换" }
];

const PageCollapseProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="CollapseItem" :rows=${itemRows} />
`);

export { PageCollapseProps };
