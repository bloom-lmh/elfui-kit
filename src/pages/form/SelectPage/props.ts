import { defineHtml, html } from "@elfui/core";

const propsRows = [
  { name: "variant / label", type: "FieldVariant / string", default: "filled / ''", desc: "六种字段表面与浮动标签；filled 兼容旧用法" },
  { name: "modelValue", type: "SelectValue | SelectValue[]", default: "''", desc: "当前选中值" },
  { name: "options", type: "SelectOption[]", default: "[]", desc: "选项数据" },
  {
    name: "props",
    type: "SelectFieldNames",
    default: "-",
    desc: "自定义 value/label/disabled/options 字段名"
  },
  { name: "valueKey", type: "string", default: "value", desc: "对象值唯一键" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  { name: "placeholder", type: "string", default: "请选择", desc: "占位文本" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用" },
  { name: "clearable", type: "boolean", default: "false", desc: "可清空" },
  {
    name: "valueOnClear",
    type: "SelectValue | SelectValue[] | Function",
    default: "-",
    desc: "清空后的值"
  },
  { name: "emptyValues", type: "unknown[]", default: "[undefined, null, '']", desc: "判空值集合" },
  { name: "multiple", type: "boolean", default: "false", desc: "多选" },
  { name: "collapseTags", type: "boolean", default: "false", desc: "折叠多选标签" },
  { name: "maxCollapseTags", type: "number", default: "1", desc: "最多展示的折叠标签数" },
  { name: "multipleLimit", type: "number", default: "0", desc: "多选数量上限，0 不限制" },
  { name: "filterable", type: "boolean", default: "false", desc: "可过滤" },
  { name: "allowCreate", type: "boolean", default: "false", desc: "允许创建新选项" },
  { name: "defaultFirstOption", type: "boolean", default: "false", desc: "回车默认选择第一项" },
  { name: "remote", type: "boolean", default: "false", desc: "远程搜索" },
  { name: "remoteMethod", type: "(query) => void", default: "-", desc: "远程搜索方法" },
  { name: "debounce", type: "number", default: "300", desc: "远程搜索防抖毫秒" },
  { name: "loading", type: "boolean", default: "false", desc: "加载状态" },
  { name: "height", type: "number", default: "240", desc: "下拉面板最大高度" },
  { name: "fitInputWidth", type: "boolean", default: "false", desc: "下拉面板宽度跟随输入框" },
  { name: "tabindex / id / name", type: "string | number", default: "-", desc: "原生表单属性" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化" },
  { name: "change", type: "(value) => void", desc: "选择变化" },
  { name: "clear", type: "() => void", desc: "清空" },
  { name: "remove-tag", type: "(value) => void", desc: "移除多选标签" },
  { name: "visible-change", type: "(visible) => void", desc: "展开/收起" },
  { name: "popup-scroll / end-reached", type: "(event) => void", desc: "下拉滚动与触底" }
];

const PageSelectEx5 = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="elf-select Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="elf-select Events" :rows=${eventsRows}></elf-props-table>
`);

export { PageSelectEx5 };
