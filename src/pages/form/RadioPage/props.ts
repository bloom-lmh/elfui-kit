import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "modelValue", type: "any" },
  { name: "value", type: "any" },
  { name: "label", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "size", type: "sm|md|lg" },
  { name: "border", type: "boolean" }
];

const groupRows = [
  { name: "modelValue", type: "any" },
  { name: "disabled", type: "boolean" },
  { name: "size", type: "sm|md|lg" },
  { name: "variant", type: "default|button" }
];

const PageRadioEx4 = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="elf-radio Props" :rows="propsRows" />
  <elf-props-table title="elf-radio-group Props" :rows="groupRows" />
`);

export { PageRadioEx4 };
