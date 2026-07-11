import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "variant", type: "text | circle | rect", default: "text", desc: "形状变体" },
  { name: "width", type: "string", default: "''", desc: "宽度，不设则用默认值" },
  { name: "height", type: "string", default: "''", desc: "高度，不设则用默认值" },
  { name: "animated", type: "boolean", default: "true", desc: "是否显示 shimmer 扫光动画" },
  { name: "count", type: "number", default: "1", desc: "重复数量" },
  { name: "gap", type: "string", default: "'12px'", desc: "行间距（count>1 时生效）" }
];

const PageSkeletonProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
`);

export { PageSkeletonProps };
