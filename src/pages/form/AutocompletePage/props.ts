import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value / options", type: "string / AutocompleteOption[]", default: "'' / []" },
  { name: "fetch-suggestions / debounce", type: "(query, callback) => void | Promise<option[]> / number", default: "undefined / 300" },
  { name: "trigger-on-focus / highlight-first-item", type: "boolean", default: "true / false" },
  { name: "loading / loading-text", type: "boolean / string", default: "false / 'Loading...'" },
  { name: "placement", type: "top | top-start | top-end | bottom | bottom-start | bottom-end", default: "bottom-start" },
  { name: "clearable / disabled / validate-event", type: "boolean", default: "false / false / true" }
];

const PageAutocompleteProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / input / change", type: "(value: string) => void" },
    { name: "select", type: "(option: AutocompleteOption) => void" },
    { name: "focus / blur / clear", type: "FocusEvent / void" }
  ]} />
  <elf-props-table title="Slots" :rows=${[
    { name: "default", desc: "custom suggestion content; receives item" },
    { name: "loading", desc: "remote loading content" }
  ]} />
  <elf-props-table title="Exposes" :rows=${[{ name: "focus / blur", desc: "manage the native input" }]} />
`);

export { PageAutocompleteProps };
