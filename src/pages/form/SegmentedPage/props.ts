import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value", type: "string | number | boolean", default: "undefined" },
  { name: "options", type: "SegmentedOption[]", default: "[]" },
  { name: "props", type: "{ label; value; disabled }", default: "{}" },
  { name: "size / block / disabled", type: "string / boolean / boolean", default: "'' / false / false" },
  { name: "name / id / validate-event", type: "string / string / boolean", default: "'' / '' / true" }
];

const PageSegmentedProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[{ name: "update:modelValue / change", type: "(value) => void" }]} />
`);

export { PageSegmentedProps };
