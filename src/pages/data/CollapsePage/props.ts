import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "model-value", type: "string | string[]", default: "''", desc: "当前展开项；accordion 时为单个 name" },
  { name: "accordion", type: "boolean", default: "false", desc: "是否一次只展开一个面板" },
  { name: "items", type: "CollapseItem[]", default: "[]", desc: "数据驱动面板数据" },
  { name: "props", type: "CollapseFieldNames", default: "默认字段映射", desc: "name/title/content/disabled 字段名称" }
];

const eventsRows = [
  { name: "update:modelValue", type: "string | string[]", desc: "展开项变化" },
  { name: "change", type: "string | string[]", desc: "提交展开项变化" }
];

const itemRows = [
  { name: "name", type: "string | number", desc: "面板唯一标识" },
  { name: "title", type: "string", default: "''", desc: "标题；可由 title slot 替换" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁止切换" }
];

const slotsRows = [
  { name: "default", desc: "CollapseItem 的面板内容" },
  { name: "title", desc: "CollapseItem 的自定义标题" },
  { name: "icon", desc: "CollapseItem 的自定义展开图标" }
];

const PageCollapseProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Collapse Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="CollapseItem Props" :rows=${itemRows} />
  <elf-props-table title="CollapseItem Slots" :rows=${slotsRows} />
`);

export { PageCollapseProps };
