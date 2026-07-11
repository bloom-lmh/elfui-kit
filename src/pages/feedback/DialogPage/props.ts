import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "open", type: "boolean", desc: "v-model:open 可见状态" },
  { name: "title", type: "string" },
  { name: "size", type: "sm|md|lg|fullscreen", default: "md" },
  { name: "close-on-mask", type: "boolean", default: "true" },
  { name: "close-on-escape", type: "boolean", default: "true" },
  { name: "closable", type: "boolean", default: "true" },
  { name: "lock-scroll", type: "boolean", default: "true" },
  { name: "before-close", type: "()=>boolean|Promise" }
];

const eventsRows = [
  { name: "update:open", type: "(open:boolean)=>void" },
  { name: "close", type: "()=>void" },
  { name: "closed", type: "()=>void" },
  { name: "opened", type: "()=>void" }
];

const PageDialogProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  />
`);

export { PageDialogProps };
