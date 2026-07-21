import { defineHtml, html } from "@elfui/core";

const propsRows = [
  { name: "image", type: "string", default: "''", desc: "自定义空状态图片地址" },
  { name: "image-size", type: "number | string", default: "160", desc: "图片或默认插画尺寸" },
  { name: "description", type: "string", default: "No data", desc: "空状态说明文字" }
];
const slotsRows = [
  { name: "image", desc: "替换默认 SVG 插画或自定义图片" },
  { name: "description", desc: "替换说明文字" },
  { name: "default", desc: "底部操作区，例如重新加载或重置筛选" }
];
const PageEmptyProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);
export { PageEmptyProps };
