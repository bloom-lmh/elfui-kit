import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "total", type: "number", default: "0", desc: "总条目数" },
  { name: "current-page", type: "number", default: "1", desc: "当前页码" },
  { name: "page-size", type: "number", default: "10", desc: "每页条数" },
  { name: "page-sizes", type: "number[]", default: "[10, 20, 50, 100]", desc: "每页条数选项" },
  { name: "pager-count", type: "number", default: "7", desc: "页码按钮数量，偶数会自动转成奇数" },
  {
    name: "layout",
    type: "string",
    default: "total, sizes, prev, pager, next, jumper",
    desc: "组件布局，支持 total/sizes/prev/pager/next/jumper"
  },
  { name: "background", type: "boolean", default: "false", desc: "是否启用有背景的页码按钮" },
  { name: "small", type: "boolean", default: "false", desc: "小尺寸分页" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用分页交互" },
  { name: "hide-on-single-page", type: "boolean", default: "false", desc: "只有一页时隐藏分页" }
];

const eventsRows = [
  { name: "update:currentPage", type: "(page: number) => void", desc: "当前页变化时触发" },
  { name: "update:pageSize", type: "(size: number) => void", desc: "每页条数变化时触发" },
  { name: "current-change", type: "(page: number) => void", desc: "当前页变化事件" },
  { name: "size-change", type: "(size: number) => void", desc: "每页条数变化事件" },
  {
    name: "change",
    type: "(page: number, size: number) => void",
    desc: "页码或页大小变化时触发"
  },
  { name: "prev-click", type: "(page: number) => void", desc: "点击上一页时触发" },
  { name: "next-click", type: "(page: number) => void", desc: "点击下一页时触发" }
];

const PagePaginationProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
`);

export { PagePaginationProps };
