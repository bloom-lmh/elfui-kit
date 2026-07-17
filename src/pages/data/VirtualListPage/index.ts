import { defineHtml, html, useComponents } from "elfui";
import { PageVirtualListEx1 } from "./ex1";
import { PageVirtualListEx2 } from "./ex2";

useComponents({ "page-virtual-list-ex1": PageVirtualListEx1, "page-virtual-list-ex2": PageVirtualListEx2 });
const propsRows = [
  { name: "items", type: "unknown[]", default: "[]", desc: "列表数据" },
  { name: "item-key", type: "string | function", default: "id", desc: "稳定项目标识" },
  { name: "render-item", type: "(item, index) => Node | primitive", default: "-", desc: "项目渲染器" },
  { name: "height", type: "string | number", default: "320", desc: "VirtualList 视口高度" },
  { name: "item-height", type: "number", default: "48", desc: "VirtualList 固定项目高度" },
  { name: "overscan", type: "number", default: "4", desc: "视口前后额外渲染数量" },
  { name: "bordered / divided", type: "boolean", default: "false / true", desc: "边框与分隔线" },
  { name: "empty-text", type: "string", default: "暂无数据", desc: "空状态文案" }
];
const PageVirtualList = defineHtml(html`
  <elf-container>
    <h1>List 与 VirtualList</h1>
    <p>普通列表与固定行高虚拟列表共享渲染契约；虚拟列表适合万级数据。</p>
    <page-virtual-list-ex1></page-virtual-list-ex1>
    <page-virtual-list-ex2></page-virtual-list-ex2>
    <h2>API</h2>
    <elf-props-table title="List / VirtualList Props" :rows=${propsRows}></elf-props-table>
  </elf-container>
`);
export { PageVirtualList };
