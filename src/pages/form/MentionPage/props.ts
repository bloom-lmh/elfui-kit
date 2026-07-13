import { defineHtml, html } from "elfui";

const rows = [
  { name: "model-value / options", type: "string / MentionOption[]", default: "'' / []" },
  { name: "prefix / prefixes", type: "string | string[] / string[]", default: "'@' / []" },
  { name: "split / whole / check-is-whole", type: "string / boolean / function", default: "' ' / false / undefined" },
  { name: "filter-option", type: "(pattern, option) => boolean", default: "undefined" },
  { name: "loading / loading-text / placement", type: "boolean / string / top | bottom", default: "false / 'Loading...' / top" },
  { name: "rows / disabled / validate-event", type: "number / boolean / boolean", default: "3 / false / true" }
];

const PageMentionProps = defineHtml(html`
  <h2>API</h2>
  <p><code>prefixes</code> is the Web Component-safe array alternative because native <code>Node.prefix</code> is read-only.</p>
  <elf-props-table title="Props" :rows=${rows} />
  <elf-props-table title="Events" :rows=${[
    { name: "update:modelValue / input", type: "(value: string) => void" },
    { name: "select", type: "(option, prefix) => void" },
    { name: "focus / blur", type: "(event: FocusEvent) => void" }
  ]} />
  <elf-props-table title="Slots" :rows=${[
    { name: "default", desc: "custom suggestion content; receives item" },
    { name: "loading", desc: "loading content" }
  ]} />
  <elf-props-table title="Exposes" :rows=${[{ name: "focus / blur", desc: "manage the native textarea" }]} />
`);

export { PageMentionProps };
