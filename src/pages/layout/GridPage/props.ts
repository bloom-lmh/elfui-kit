import { defineHtml, html } from "elfui";

const gridRows = [
  { name: "columns", type: "number", default: "12", desc: "总列数" },
  { name: "gap", type: "0|xs|sm|md|lg|xl", default: "0" },
  { name: "gutter", type: "number|string", default: "—", desc: "栅格间隔；设置后优先于 gap" },
  { name: "justify", type: "start|end|center|space-between|space-around|space-evenly", default: "start" },
  { name: "align", type: "stretch|start|center|end", default: "stretch" },
  { name: "auto-fit", type: "boolean", default: "false", desc: "按可用空间自动生成列" },
  { name: "min-column-width", type: "string", default: "220px", desc: "自动列的最小宽度" }
];

const itemRows = [
  { name: "span", type: "number", default: "1", desc: "占用列数" },
  { name: "offset", type: "number", default: "0", desc: "左侧间隔列数" },
  { name: "push", type: "number", default: "0", desc: "向右移动列数" },
  { name: "pull", type: "number", default: "0", desc: "向左移动列数" },
  { name: "xs / sm / md / lg / xl", type: "number | { span, offset, push, pull }", default: "—", desc: "响应式栅格配置" }
];

const PageGridProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="elf-grid Props" :rows="gridRows" /><elf-props-table
    title="elf-grid-item Props"
    :rows="itemRows"
  />
`);

export { PageGridProps };
