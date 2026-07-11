import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "size", type: "sm | md | lg | xl", default: "md", desc: "尺寸" },
  { name: "shape", type: "circle | square", default: "circle", desc: "形状" },
  { name: "src", type: "string", default: "''", desc: "图片地址，设置后优先展示" },
  { name: "alt", type: "string", default: "''", desc: "替代文本，同时用于生成首字母缩写" },
  { name: "icon", type: "string", default: "''", desc: "Unicode 图标" },
  { name: "color", type: "string", default: "''", desc: "自定义背景色（#hex 或语义色名）" }
];

const slotsRows = [];

const PageAvatarProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
`);

export { PageAvatarProps };
