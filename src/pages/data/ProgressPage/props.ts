import { defineHtml, html } from "elfui";

const propsRows = [
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
  { name: "height", type: "string", default: "8px", desc: "条形高度" },
  { name: "size", type: "number", default: "96", desc: "环形尺寸" },
  { name: "stroke-width", type: "number", default: "8", desc: "环形线宽" },
  { name: "show-text", type: "boolean", default: "true", desc: "显示文字" },
  { name: "text-inside", type: "boolean", default: "false", desc: "条形文字内置" },
  { name: "striped", type: "boolean", default: "false", desc: "条纹进度" },
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
