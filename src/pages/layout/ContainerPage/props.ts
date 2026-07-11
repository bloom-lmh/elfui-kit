import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "max-width", type: "xs|sm|md|lg|xl|full", default: "lg", desc: "最大宽度档位" },
  { name: "padding", type: "0|sm|md|lg", default: "md", desc: "内边距档位" }
];

const PageContainerProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
`);

export { PageContainerProps };
