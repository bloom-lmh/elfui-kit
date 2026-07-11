import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "modelValue", type: "number | [number, number]", default: "0", desc: "当前值" },
  { name: "min", type: "number", default: "0", desc: "最小值" },
  { name: "max", type: "number", default: "100", desc: "最大值" },
  { name: "step", type: "number", default: "1", desc: "步长" },
  { name: "range", type: "boolean", default: "false", desc: "范围选择" },
  { name: "vertical", type: "boolean", default: "false", desc: "纵向滑块" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用状态" },
  { name: "readonly", type: "boolean", default: "false", desc: "只读状态" },
  { name: "showTooltip", type: "boolean", default: "true", desc: "显示数值气泡" },
  { name: "showStops", type: "boolean", default: "false", desc: "显示步进点" },
  { name: "segmented", type: "boolean", default: "false", desc: "按 step 或 marks 分段展示轨道" },
  {
    name: "showInput",
    type: "boolean",
    default: "false",
    desc: "显示数字输入框，范围模式下无效"
  },
  {
    name: "marks",
    type: "SliderMark[] | Record<string, string>",
    default: "[]",
    desc: "刻度标记"
  },
  {
    name: "formatTooltip",
    type: "(value) => string",
    default: "undefined",
    desc: "格式化气泡文案"
  },
  { name: "color", type: "string", default: "''", desc: "激活轨道颜色" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化时触发" },
  { name: "input", type: "(value) => void", desc: "拖动输入时触发" },
  { name: "change", type: "(value) => void", desc: "提交变化时触发" }
];

const methodsRows = [
  { name: "setValue(value)", desc: "主动设置值并触发 change" },
  { name: "clear()", desc: "清空为最小值" }
];

const PageSliderProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
  <elf-props-table title="Methods" :rows="methodsRows"></elf-props-table>
`);

export { PageSliderProps };
