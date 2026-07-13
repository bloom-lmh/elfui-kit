import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "type", type: "primary|success|warning|danger|info|button|submit|reset", default: "''" },
  { name: "native-type", type: "button|submit|reset", default: "button" },
  { name: "variant", type: "contained|outlined|text", default: "contained" },
  { name: "color", type: "primary|success|warning|danger|info|secondary", default: "primary" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "shape", type: "default|round|circle|square", default: "default" },
  { name: "text", type: "boolean", default: "false" },
  { name: "bg", type: "boolean", default: "false" },
  { name: "link", type: "boolean", default: "false" },
  { name: "round", type: "boolean", default: "false" },
  { name: "circle", type: "boolean", default: "false" },
  { name: "icon", type: "string", default: "''" },
  { name: "loading-icon", type: "string", default: "''" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "loading", type: "boolean", default: "false" },
  { name: "block", type: "boolean", default: "false" },
  { name: "plain", type: "boolean", default: "false" },
  { name: "dashed", type: "boolean", default: "false" },
  { name: "auto-insert-space", type: "boolean", default: "false" },
  { name: "dark", type: "boolean", default: "false" },
  { name: "no-hover", type: "boolean", default: "false", desc: "禁用 hover 效果" },
  { name: "direction", type: "horizontal|vertical", default: "horizontal" }
];

const eventsRows = [{ name: "click", type: "(event: MouseEvent) => void", desc: "click event" }];

const slotsRows = [
  { name: "default", desc: "button content" },
  { name: "icon", desc: "prefix icon" },
  { name: "suffix-icon", desc: "suffix icon" },
  { name: "loading", desc: "loading icon" }
];

const PageButtonProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageButtonProps };
