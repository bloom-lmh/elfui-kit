import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "content", type: "string", default: "''", desc: "提示内容" },
  {
    name: "placement",
    type: "top | bottom | left | right",
    default: "top",
    desc: "气泡弹出位置"
  },
  { name: "disabled", type: "boolean", default: "false", desc: "是否禁用提示" },
  {
    name: "trigger",
    type: "hover | focus | click | contextmenu | manual",
    default: "hover",
    desc: "触发事件类型"
  },
  { name: "show-after", type: "number", default: "0", desc: "显示延迟（毫秒）" },
  { name: "hide-after", type: "number", default: "0", desc: "隐藏延迟（毫秒）" },
  { name: "effect", type: "dark | light", default: "dark", desc: "主题风格" },
  { name: "visible", type: "boolean", default: "undefined", desc: "手动控制显示隐藏" }
];

const PageTooltipProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
`);

export { PageTooltipProps };
