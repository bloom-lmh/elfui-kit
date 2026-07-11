import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "open", type: "boolean", desc: "v-model:open" },
  { name: "title", type: "string" },
  { name: "direction", type: "rtl|ltr|ttb|btt", default: "rtl" },
  { name: "size", type: "string", default: "'30%'" },
  { name: "modal", type: "boolean", default: "true" },
  { name: "close-on-mask", type: "boolean", default: "true" },
  { name: "close-on-escape", type: "boolean", default: "true" },
  { name: "closable", type: "boolean", default: "true" },
  { name: "lock-scroll", type: "boolean", default: "true" },
  { name: "before-close", type: "()=>boolean|Promise" }
];

const eventsRows = [
  { name: "update:open", type: "(open:boolean)=>void" },
  { name: "close" },
  { name: "closed" },
  { name: "opened" }
];

const PageDrawerProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  />
`);

export { PageDrawerProps };
