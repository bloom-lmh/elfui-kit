import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "modelValue", type: "boolean", default: "false", desc: "当前开关值" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用" },
  { name: "loading", type: "boolean", default: "false", desc: "加载中，加载时不可切换" },
  { name: "active-text", type: "string", default: "''", desc: "打开态文字" },
  { name: "inactive-text", type: "string", default: "''", desc: "关闭态文字" },
  { name: "label", type: "string", default: "''", desc: "主标签，也可以使用默认 slot" },
  { name: "label-position", type: "start | end", default: "end", desc: "主标签位置" },
  { name: "inset", type: "boolean", default: "false", desc: "内嵌轨道样式" },
  { name: "flat", type: "boolean", default: "false", desc: "扁平样式" },
  {
    name: "color",
    type: "primary | success | warning | danger | info | CSSColor",
    default: "primary",
    desc: "打开态颜色"
  },
  { name: "active-color", type: "string", default: "''", desc: "自定义打开态颜色" },
  { name: "inactive-color", type: "string", default: "''", desc: "自定义关闭态颜色" },
  {
    name: "before-change",
    type: "(next: boolean) => boolean | Promise<boolean>",
    default: "-",
    desc: "切换前拦截"
  }
];

const eventRows = [
  { name: "update:modelValue", type: "boolean", desc: "值更新" },
  { name: "change", type: "boolean", desc: "切换后触发" }
];

const PageSwitchProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventRows"></elf-props-table>
`);

export { PageSwitchProps };
