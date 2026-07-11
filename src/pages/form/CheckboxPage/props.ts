import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "modelValue", type: "boolean|unknown[]", default: "false" },
  { name: "value", type: "any", desc: "Group 模式下本项值" },
  { name: "label", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "indeterminate", type: "boolean", desc: "半选" }
];

const groupRows = [
  { name: "modelValue", type: "unknown[]", default: "[]" },
  { name: "disabled", type: "boolean" },
  { name: "min", type: "number", default: "0" },
  { name: "max", type: "number", default: "Infinity" }
];

const PageCheckboxEx4 = defineHtml(html`
  <h2>其他状态</h2>
  <elf-playground title="半选 / 禁用">
    <elf-checkbox indeterminate label="全选" />
    <elf-checkbox disabled label="不可选" />
  </elf-playground>
  <h2>API</h2>
  <elf-props-table title="elf-checkbox Props" :rows="propsRows" />
  <elf-props-table title="elf-checkbox-group Props" :rows="groupRows" />
`);

export { PageCheckboxEx4 };
