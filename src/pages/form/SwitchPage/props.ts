import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value / active-value / inactive-value", type: "string | number | boolean", default: "false / true / false" },
  { name: "size / width / inline-prompt", type: "sm | md | lg / string | number / boolean", default: "md / auto / false" },
  { name: "active-text / inactive-text / active-icon / inactive-icon", type: "string", default: "''" },
  { name: "disabled / loading / validate-event", type: "boolean", default: "false / false / true" },
  { name: "id / tabindex / aria-label", type: "string / number / string", default: "'' / 0 / ''" },
  { name: "active-color / inactive-color / border-color", type: "string", default: "''" },
  { name: "before-change", type: "(nextValue) => boolean | Promise<boolean>", default: "undefined" }
];

const PageSwitchProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[{ name: "update:modelValue / change", type: "(value: SwitchValue) => void" }]} />
  <elf-props-table title="Slots" :rows=${[
    { name: "default", desc: "main label" },
    { name: "active / inactive", desc: "inline prompt content" },
    { name: "active-action / inactive-action", desc: "track action content" }
  ]} />
`);

export { PageSwitchProps };
