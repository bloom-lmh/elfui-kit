import { defineHtml, html } from "elfui";

const splitterRows = [
  { name: "modelValue", type: "number", default: "50", desc: "第一个面板所占百分比" },
  { name: "min", type: "number", default: "10", desc: "第一个面板最小百分比" },
  { name: "max", type: "number", default: "90", desc: "第一个面板最大百分比" },
  { name: "vertical", type: "boolean", default: "false", desc: "垂直分割（上下布局）" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用拖拽调整" }
];

const slotRows = [
  { name: "first", desc: "第一个面板内容" },
  { name: "second", desc: "第二个面板内容" }
];

const eventRows = [
  { name: "update:modelValue", type: "CustomEvent<number>", desc: "拖拽调整时触发，detail 为新的百分比值" }
];

const PageSplitterProps = defineHtml(html`
  <h2>Props</h2>
  <elf-props-table title="elf-splitter Props" :rows="splitterRows" />
  <h2>Slots</h2>
  <elf-props-table title="elf-splitter Slots" :rows="slotRows" />
  <h2>Events</h2>
  <elf-props-table title="elf-splitter Events" :rows="eventRows" />
`);

export { PageSplitterProps };
