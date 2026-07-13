import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value", type: "string[]", default: "[]" },
  { name: "trigger", type: "enter | blur", default: "enter" },
  { name: "tag-type / tag-effect", type: "string", default: "'' / light" },
  { name: "draggable / validate-event", type: "boolean", default: "false / true" },
  { name: "clearable / max / size", type: "boolean / number / string", default: "false / undefined / ''" }
];

const PageInputTagProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Slots" :rows=${[{ name: "prefix / suffix", desc: "custom input adornments" }]} />
`);

export { PageInputTagProps };
