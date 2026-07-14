import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "direction", type: "row|row-reverse|column|column-reverse", default: "row" },
  {
    name: "justify",
    type: "flex-start|flex-end|center|space-between|space-around|space-evenly",
    default: "flex-start"
  },
  { name: "align", type: "stretch|flex-start|flex-end|center|baseline", default: "stretch" },
  { name: "alignment", type: "FlexAlign", default: "''", desc: "Space 兼容别名，优先于 align" },
  { name: "gap", type: "preset|string|number|[number, number]", default: "0" },
  { name: "size", type: "preset|string|number|[number, number]", default: "''", desc: "Space 兼容别名，优先于 gap" },
  { name: "wrap", type: "boolean", default: "false", desc: "空间不足时自动换行" },
  { name: "inline", type: "boolean", default: "false", desc: "使用 inline-flex" },
  { name: "fill", type: "boolean", default: "false", desc: "填满父容器可用尺寸" },
  { name: "fill-ratio", type: "number", default: "100", desc: "fill 子项占比，限制在 0~100" }
];

const slotsRows = [{ name: "default", type: "-", default: "-", desc: "Flex 子项" }];

const PageFlexProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageFlexProps };
