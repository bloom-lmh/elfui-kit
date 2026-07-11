import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "data", type: "TransferDataItem[]", default: "[]", desc: "数据源数组" },
  { name: "model-value", type: "string[]", default: "[]", desc: "选中项 key 数组（v-model）" },
  {
    name: "titles",
    type: "[string, string]",
    default: "['源列表', '目标列表']",
    desc: "左右面板标题"
  },
  { name: "filterable", type: "boolean", default: "false", desc: "是否显示搜索框" },
  {
    name: "filter-placeholder",
    type: "string",
    default: "'请输入搜索内容'",
    desc: "搜索框占位文本"
  },
  {
    name: "props",
    type: "{ key, label, disabled? }",
    default: "{ key:'key', label:'label' }",
    desc: "字段别名映射"
  }
];

const eventsRows = [
  { name: "update:modelValue", type: "(keys: string[]) => void", desc: "选中项变化时触发" }
];

const PageTransferProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  />
`);

export { PageTransferProps };
