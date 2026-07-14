import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "type", type: "primary|success|warning|danger|info|secondary", default: "''" },
  { name: "color", type: "string", default: "primary", desc: "语义色名称或任意 CSS 颜色" },
  { name: "effect", type: "dark|light|plain", default: "''" },
  { name: "variant", type: "filled|light|outlined", default: "light" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "closable", type: "boolean", default: "false" },
  { name: "round", type: "boolean", default: "false" },
  { name: "hit", type: "boolean", default: "false" },
  { name: "checked", type: "boolean", default: "undefined" },
  { name: "disable-transitions", type: "boolean", default: "false" },
  { name: "disabled", type: "boolean", default: "false" }
];

const eventsRows = [
  { name: "click", type: "(event: MouseEvent) => void", desc: "tag click" },
  { name: "close", type: "(event: Event) => void", desc: "close button click" },
  { name: "change", type: "(checked: boolean) => void", desc: "checked changed" },
  { name: "update:checked", type: "(checked: boolean) => void", desc: "checked model update" }
];

const slotsRows = [
  { name: "default", type: "-", default: "-", desc: "标签内容" }
];

const PageTagProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageTagProps };
