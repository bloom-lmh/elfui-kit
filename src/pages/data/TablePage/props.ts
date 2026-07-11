import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "data", type: "Record<string, unknown>[]", default: "[]", desc: "表格数据" },
  {
    name: "columns",
    type: "TableColumn[]",
    default: "[]",
    desc: "列配置；为空时从第一行自动推导"
  },
  { name: "row-key", type: "string", default: "id", desc: "行唯一标识字段" },
  { name: "stripe", type: "boolean", default: "false", desc: "斑马纹表格" },
  { name: "border", type: "boolean", default: "false", desc: "纵向边框" },
  { name: "hover", type: "boolean", default: "true", desc: "鼠标悬停高亮" },
  { name: "size", type: "small | default | large", default: "default", desc: "表格尺寸" },
  { name: "height", type: "string", default: "''", desc: "固定高度，内容超出滚动" },
  { name: "max-height", type: "string", default: "''", desc: "最大高度，内容超出滚动" },
  { name: "empty-text", type: "string", default: "暂无数据", desc: "空状态文案" },
  { name: "loading", type: "boolean", default: "false", desc: "加载遮罩" },
  { name: "show-header", type: "boolean", default: "true", desc: "是否显示表头" },
  { name: "sticky-header", type: "boolean", default: "true", desc: "表头在纵向滚动时吸附" },
  { name: "highlight-current-row", type: "boolean", default: "false", desc: "点击后高亮当前行" },
  { name: "current-row-key", type: "string", default: "''", desc: "受控当前行 key" },
  { name: "selected-keys", type: "string[]", default: "undefined", desc: "受控选择行 key" },
  {
    name: "default-selected-keys",
    type: "string[]",
    default: "[]",
    desc: "非受控初始选择行 key"
  },
  { name: "expanded-row-keys", type: "string[]", default: "undefined", desc: "受控展开行 key" },
  {
    name: "default-expanded-row-keys",
    type: "string[]",
    default: "[]",
    desc: "非受控初始展开行 key"
  },
  {
    name: "expand-formatter",
    type: "(row, index) => unknown",
    default: "undefined",
    desc: "展开行内容格式化函数"
  },
  { name: "sort-prop", type: "string", default: "''", desc: "受控排序字段" },
  { name: "sort-order", type: "ascending | descending | ''", default: "''", desc: "受控排序方向" }
];

const columnRows = [
  { name: "prop", type: "string", default: "''", desc: "字段名" },
  { name: "label", type: "string", default: "prop", desc: "表头文字" },
  {
    name: "type",
    type: "default | selection | index | expand | actions",
    default: "default",
    desc: "列类型"
  },
  { name: "width", type: "string | number", default: "''", desc: "列宽" },
  { name: "minWidth", type: "string | number", default: "120", desc: "最小列宽" },
  { name: "align", type: "left | center | right", default: "left", desc: "对齐方式" },
  {
    name: "fixed",
    type: "left | right",
    default: "undefined",
    desc: "固定列，横向滚动时吸附到左侧或右侧"
  },
  { name: "sortable", type: "boolean", default: "false", desc: "是否允许点击表头排序" },
  {
    name: "formatter",
    type: "(row, column, index) => unknown",
    default: "undefined",
    desc: "单元格格式化函数"
  },
  {
    name: "cellStyle",
    type: "object | (row, column, index) => object",
    default: "undefined",
    desc: "单元格内联样式，适合状态色、金额高亮等场景"
  },
  {
    name: "cellClassName",
    type: "string | (row, column, index) => string",
    default: "undefined",
    desc: "单元格 class 名"
  },
  {
    name: "actions",
    type: "TableAction[]",
    default: "[]",
    desc: "actions 列的按钮配置，支持 label/type/disabled/onClick"
  }
];

const eventsRows = [
  {
    name: "update:selectedKeys",
    type: "(keys: string[]) => void",
    desc: "选择行 key 变化时触发"
  },
  { name: "selection-change", type: "(rows: Row[]) => void", desc: "选择行数据变化时触发" },
  { name: "current-change", type: "(row, oldRow) => void", desc: "当前行变化时触发" },
  { name: "row-click", type: "(row, index) => void", desc: "点击行时触发" },
  { name: "update:expandedRowKeys", type: "(keys: string[]) => void", desc: "展开行变化时触发" },
  { name: "expand-change", type: "(row, keys) => void", desc: "展开或收起行时触发" },
  {
    name: "action-click",
    type: "(action, row, index) => void",
    desc: "点击 actions 操作按钮时触发"
  },
  { name: "sort-change", type: "({ prop, order }) => void", desc: "排序变化时触发" }
];

const methodsRows = [
  { name: "clearSelection()", type: "() => void", desc: "清空选择" },
  {
    name: "toggleRowSelection(rowOrKey, selected?)",
    type: "(Row | string, boolean?) => void",
    desc: "切换单行选择"
  },
  {
    name: "toggleRowExpansion(rowOrKey, expanded?)",
    type: "(Row | string, boolean?) => void",
    desc: "切换单行展开状态"
  },
  { name: "getSelectionRows()", type: "() => Row[]", desc: "获取已选择行" },
  { name: "setCurrentRow(rowOrKey)", type: "(Row | string) => void", desc: "设置当前行" },
  {
    name: "sort(prop, order)",
    type: "(string, 'ascending' | 'descending' | '') => void",
    desc: "主动排序"
  },
  { name: "clearSort()", type: "() => void", desc: "清除排序" }
];

const PageTableProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Column" :rows="columnRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
  <elf-props-table title="Methods" :rows="methodsRows"></elf-props-table>
`);

export { PageTableProps };
