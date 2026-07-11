import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "top", type: "string | number", default: "0", desc: "顶部吸附偏移" },
  {
    name: "bottom",
    type: "string | number",
    default: "''",
    desc: "底部吸附偏移；设置后启用 bottom 模式"
  },
  { name: "zIndex", type: "string | number", default: "10", desc: "吸附层级" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用吸附" }
];

const eventsRows = [
  { name: "change", type: "(stuck: boolean) => void", desc: "吸附状态变化时触发" }
];

const slotsRows = [{ name: "default", desc: "需要吸附的内容" }];

const PageStickyProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
  <elf-props-table title="Slots" :rows="slotsRows"></elf-props-table>
`);

export { PageStickyProps };
