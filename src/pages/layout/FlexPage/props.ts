import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "direction", type: "row|row-reverse|column|column-reverse", default: "row" },
  {
    name: "justify",
    type: "flex-start|flex-end|center|space-between|space-around|space-evenly",
    default: "flex-start"
  },
  { name: "align", type: "stretch|flex-start|flex-end|center|baseline", default: "stretch" },
  { name: "gap", type: "0|xs|sm|md|lg|xl", default: "0" },
  { name: "wrap", type: "boolean", default: "false" }
];

const PageFlexProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
`);

export { PageFlexProps };
