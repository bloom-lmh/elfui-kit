import { defineHtml, html } from "elfui";

const propsRows = [
  {
    name: "type",
    type: "info | success | warning | danger",
    default: "info"
  },
  {
    name: "variant",
    type: "light | filled | outlined",
    default: "light"
  },
  { name: "title", type: "string", default: "''", desc: "标题" },
  { name: "description", type: "string", default: "''", desc: "副标题/详情" },
  { name: "closable", type: "boolean", default: "false", desc: "显示关闭按钮" },
  { name: "show-icon", type: "boolean", default: "true", desc: "显示图标" },
  { name: "center", type: "boolean", default: "false", desc: "内容居中" }
];

const eventsRows = [{ name: "close", type: "() => void", desc: "点击关闭按钮触发" }];

const PageAlertProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table
  ><elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
`);

export { PageAlertProps };
