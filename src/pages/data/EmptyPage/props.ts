import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "image", type: "string", default: "''", desc: "自定义空状态图片地址" },
  { name: "image-size", type: "number | string", default: "160", desc: "图片或占位图尺寸" },
  { name: "description", type: "string", default: "'No data'", desc: "空状态说明文字" }
];

const slotsRows = [
  { name: "image", desc: "替换图片或默认占位图" },
  { name: "description", desc: "替换说明文字" },
  { name: "default", desc: "底部操作区，例如重新加载或重置筛选" }
];

const PageEmptyProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageEmptyProps };
