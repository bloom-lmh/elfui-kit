import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "model-value", type: "number | null", default: "undefined" },
  { name: "min / max / step", type: "number", default: "undefined / undefined / 1" },
  { name: "step-strictly / precision", type: "boolean / number", default: "false / auto" },
  { name: "value-on-clear", type: "number | null", default: "null" },
  { name: "controls / controls-position", type: "boolean / right", default: "true / ''" },
  { name: "disabled / readonly", type: "boolean", default: "false" },
  { name: "validate-event", type: "boolean", default: "true" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value: number | null) => void" },
  { name: "input / change", type: "(value: number | null) => void" },
  { name: "focus / blur", type: "(event: FocusEvent) => void" }
];

const PageInputNumberProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Exposes" :rows=${[{ name: "focus / blur", desc: "focus or blur the native number input" }]} />
`);

export { PageInputNumberProps };
