import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "color", type: "primary|success|warning|danger|info|secondary", default: "primary" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "variant", type: "filled|light|outlined", default: "light" },
  { name: "closable", type: "boolean", default: "false" },
  { name: "round", type: "boolean", default: "false" },
  { name: "disabled", type: "boolean", default: "false" }
];

const eventsRows = [
  { name: "close", type: "(e:Event)=>void", desc: "点击关闭按钮" },
  { name: "click", type: "(e:Event)=>void", desc: "点击标签" }
];

const PageTagProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  />
`);

export { PageTagProps };
