import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "modelValue", type: "string" },
  { name: "rows", type: "number", default: "3" },
  { name: "placeholder", type: "string" },
  { name: "disabled", type: "boolean" },
  { name: "readonly", type: "boolean" },
  { name: "maxlength", type: "number" },
  { name: "show-count", type: "boolean", desc: "配合 maxlength 显示 cur/max" },
  { name: "autosize", type: "boolean|{minRows,maxRows}", desc: "自动调整高度" },
  { name: "resize", type: "none|both|horizontal|vertical", default: "vertical" }
];

const eventsRows = [
  { name: "input", type: "(v: string) => void" },
  { name: "change", type: "(v: string) => void" },
  { name: "focus", type: "(e) => void" },
  { name: "blur", type: "(e) => void" }
];

const PageTextareaProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="Events" :rows="eventsRows" />
`);

export { PageTextareaProps };
