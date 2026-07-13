import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "percentage", type: "number", default: "0", desc: "当前百分比，优先于 value/max" },
  { name: "type", type: "line | circle | dashboard", default: "line", desc: "进度条形态" },
  { name: "value", type: "number", default: "0", desc: "当前值" },
  { name: "max", type: "number", default: "100", desc: "最大值" },
  { name: "variant", type: "line | circle", default: "line", desc: "形态" },
  {
    name: "status",
    type: "primary | success | warning | danger | info",
    default: "''",
    desc: "状态色"
  },
  { name: "color", type: "string", default: "''", desc: "自定义进度色" },
  { name: "track-color", type: "string", default: "''", desc: "自定义轨道色" },
  { name: "height", type: "string", default: "''", desc: "条形高度（扩展）" },
  { name: "duration", type: "number", default: "3", desc: "不确定/流动条纹动画时长（秒）" },
  { name: "width", type: "number", default: "126", desc: "圆形/仪表盘尺寸" },
  { name: "size", type: "number", default: "0", desc: "环形尺寸（扩展，优先于 width）" },
  { name: "stroke-width", type: "number", default: "6", desc: "进度线宽" },
  { name: "stroke-linecap", type: "butt | round | square", default: "round", desc: "圆形路径端点形状" },
  { name: "show-text", type: "boolean", default: "true", desc: "显示文字" },
  { name: "text-inside", type: "boolean", default: "false", desc: "条形文字内置" },
  { name: "striped", type: "boolean", default: "false", desc: "条纹进度" },
  { name: "striped-flow", type: "boolean", default: "false", desc: "让条纹流动" },
  { name: "indeterminate", type: "boolean", default: "false", desc: "不确定进度" },
  {
    name: "format",
    type: "(percent: number, value: number) => string",
    default: "-",
    desc: "自定义文字"
  }
];

const PageProgressProps = defineHtml(
  html`<h2>API</h2>
    <elf-props-table title="Props" :rows="propsRows"></elf-props-table>`
);

export { PageProgressProps };
