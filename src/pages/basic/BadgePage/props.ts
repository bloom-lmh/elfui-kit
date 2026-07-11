import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "value", type: "string | number", default: "''", desc: "显示值，数字自动走 max 截断" },
  { name: "max", type: "number", default: "99", desc: "最大值，超出显示 99+" },
  { name: "is-dot", type: "boolean", default: "false", desc: "圆点模式，只显示 8px 圆点" },
  { name: "hidden", type: "boolean", default: "false", desc: "隐藏徽章" },
  {
    name: "type",
    type: "primary | success | warning | danger | info",
    default: "danger",
    desc: "颜色类型"
  },
  { name: "show-zero", type: "boolean", default: "true", desc: "value 为 0 时是否显示" },
  { name: "color", type: "string", default: "''", desc: "自定义背景色（CSS 颜色值）" }
];

const slotsRows = [{ name: "default", desc: "徽章所依附的内容" }];

const PageBadgeProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Slots"
    :rows="slotsRows"
  />
`);

export { PageBadgeProps };
