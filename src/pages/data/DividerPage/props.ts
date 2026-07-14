import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "direction", type: "horizontal|vertical", default: "horizontal" },
  { name: "content-position", type: "left|center|right", default: "center" },
  { name: "border-style", type: "solid|dashed|dotted|double", default: "solid" },
  { name: "dashed", type: "boolean", default: "false" }
];

const PageDividerProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
`);

export { PageDividerProps };
