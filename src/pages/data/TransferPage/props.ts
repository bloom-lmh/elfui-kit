import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "data", type: "TransferDataItem[]", default: "[]", desc: "Source records" },
  { name: "model-value", type: "string[]", default: "[]", desc: "Selected target keys" },
  { name: "titles", type: "[string, string]", default: "['Source', 'Target']", desc: "Panel headings" },
  { name: "filterable", type: "boolean", default: "false", desc: "Show filter inputs" },
  { name: "filter-placeholder", type: "string", default: "'Search'", desc: "Filter placeholder" },
  { name: "filter-method", type: "(query, item) => boolean", default: "undefined", desc: "Custom filter predicate" },
  { name: "target-order", type: "original | push | unshift", default: "original", desc: "Target display and insertion order" },
  { name: "button-texts", type: "[left, right]", default: "[]", desc: "Transfer action labels" },
  { name: "format", type: "{ noChecked, hasChecked }", default: "{}", desc: "Header count templates" },
  { name: "left-default-checked / right-default-checked", type: "string[]", default: "[]", desc: "Initial selectable checked keys" },
  { name: "props", type: "{ key, label, disabled? }", default: "{ key:'key', label:'label', disabled:'disabled' }", desc: "Field mappings" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(keys: string[]) => void", desc: "Target keys changed" },
  { name: "change", type: "(keys, direction, movedKeys) => void", desc: "A transfer completed" },
  { name: "left-check-change / right-check-change", type: "(checkedKeys, changedKeys) => void", desc: "Panel checked state changed" }
];

const exposesRows = [
  { name: "clearQuery", type: "(side?: 'left' | 'right') => void", desc: "Clear one or both filters" },
  { name: "leftPanel / rightPanel", type: "{ query: string }", desc: "Current filter query views" }
];

const PageTransferProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Events" :rows.prop=${eventsRows} />
  <elf-props-table title="Exposes" :rows.prop=${exposesRows} />
`);

export { PageTransferProps };
