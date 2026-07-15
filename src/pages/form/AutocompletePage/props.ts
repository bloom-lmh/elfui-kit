import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value / options", type: "string / AutocompleteOption[]", default: "'' / []" },
  { name: "fetch-suggestions / debounce", type: "(query, callback) => void | Promise<option[]> / number", default: "undefined / 300" },
  { name: "trigger-on-focus / highlight-first-item", type: "boolean", default: "true / false" },
  { name: "loading / loading-text", type: "boolean / string", default: "false / 'Loading...'" },
  { name: "placement", type: "top | top-start | top-end | bottom | bottom-start | bottom-end", default: "bottom-start" },
  { name: "teleported / append-to", type: "boolean / CSS selector | HTMLElement", default: "true / body" },
  { name: "popper-options / popper-class / popper-style", type: "object / string / object", default: "{} / '' / {}" },
  { name: "fit-input-width", type: "boolean", default: "false" },
  { name: "clearable / disabled / validate-event", type: "boolean", default: "false / false / true" }
];

const PageAutocompleteProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="属性" :rows=${rows} />
  <elf-props-table title="事件" :rows=${[
    { name: "update:modelValue / input / change", type: "(value: string) => void" },
    { name: "select", type: "(option: AutocompleteOption) => void" },
    { name: "focus / blur / clear", type: "FocusEvent / void" }
  ]} />
  <elf-props-table title="插槽" :rows=${[
    { name: "default", desc: "custom suggestion content; receives item" },
    { name: "loading", desc: "remote loading content" }
  ]} />
  <elf-props-table title="方法" :rows=${[
    { name: "focus / blur", desc: "聚焦或失焦原生输入框" },
    { name: "close", desc: "关闭建议面板" }
  ]} />
`);

export { PageAutocompleteProps };
