import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "variant", type: "contained|outlined|text", default: "contained" },
  { name: "color", type: "primary|success|warning|danger|info|secondary", default: "primary" },
  { name: "size", type: "sm|md|lg", default: "md" },
  { name: "shape", type: "default|round|circle|square", default: "default" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "loading", type: "boolean", default: "false" },
  { name: "block", type: "boolean", default: "false" },
  { name: "plain", type: "boolean", desc: "淡色背景" },
  { name: "dashed", type: "boolean", desc: "虚线边框" },
  { name: "type", type: "button|submit|reset", default: "button" }
];

const eventsRows = [{ name: "click", type: "(e:MouseEvent)=>void", desc: "点击事件" }];

const slotsRows = [
  { name: "default", desc: "按钮文字" },
  { name: "icon", desc: "前置图标" },
  { name: "suffix-icon", desc: "后置图标" }
];

const PageButtonProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  /><elf-props-table title="Slots" :rows="slotsRows" />
`);

export { PageButtonProps };
