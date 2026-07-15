import { defineHtml, html, useComponents } from "elfui";

import { PageCascaderEx1 } from "./ex1";
import { PageCascaderEx2 } from "./ex2";
import { PageCascaderEx3 } from "./ex3";
import { PageCascaderEx4 } from "./ex4";
import { PageCascaderEx5 } from "./ex5";
import { PageCascaderEx6 } from "./ex6";
import { PageCascaderEx7 } from "./ex7";

const propsRows = [
  {
    name: "modelValue",
    type: "CascaderValue[] | CascaderValue[][]",
    default: "[]",
    desc: "当前选中路径；多选/checkbox 模式为路径数组列表"
  },
  { name: "options", type: "CascaderOption[]", default: "[]", desc: "级联选项树" },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  { name: "placeholder", type: "string", default: "请选择", desc: "占位文本" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用状态" },
  { name: "clearable", type: "boolean", default: "false", desc: "是否可清空" },
  { name: "teleported / appendTo / persistent", type: "boolean / selector | HTMLElement / boolean", default: "true / body / true", desc: "浮层挂载与持久化" },
  { name: "placement / fitInputWidth", type: "CascaderPlacement / boolean", default: "bottom-start / false", desc: "浮层方向与输入宽度匹配" },
  { name: "popperClass / popperStyle / popperOptions", type: "string / object / object", default: "'' / {} / {}", desc: "浮层样式和定位修饰器" },
  { name: "multiple", type: "boolean", default: "false", desc: "是否允许选择多个叶子节点" },
  { name: "checkable", type: "boolean", default: "false", desc: "是否显示选项框并支持父子勾选" },
  { name: "checkStrictly", type: "boolean", default: "false", desc: "父子节点选择互不关联" },
  { name: "emitPath", type: "boolean", default: "true", desc: "是否返回完整路径" },
  { name: "showAllLevels", type: "boolean", default: "true", desc: "是否展示完整路径" },
  {
    name: "collapseTags / maxCollapseTags",
    type: "boolean / number",
    default: "false / 1",
    desc: "多选标签折叠"
  },
  { name: "showCheckedStrategy", type: "child | parent", default: "child", desc: "多选回显策略" },
  { name: "expandTrigger", type: "click | hover", default: "click", desc: "展开子级触发方式" },
  {
    name: "checkOnClickNode / checkOnClickLeaf",
    type: "boolean",
    default: "false / true",
    desc: "点击节点/叶子切换勾选"
  },
  { name: "showPrefix", type: "boolean", default: "true", desc: "是否显示勾选前缀" },
  {
    name: "filterable / debounce",
    type: "boolean / number",
    default: "false / 300",
    desc: "Enable debounced selectable-path searching"
  },
  { name: "filterMethod", type: "(node, keyword) => boolean", default: "-", desc: "Custom search result matcher" },
  { name: "beforeFilter", type: "(keyword) => boolean | Promise<boolean>", default: "-", desc: "Cancels or asynchronously gates a search" },
  { name: "separator", type: "string", default: "' / '", desc: "回显路径分隔符" },
  { name: "props", type: "CascaderFieldNames", default: "-", desc: "自定义字段名" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "选中路径变化" },
  { name: "change", type: "({ value, path, selected, multiple }) => void", desc: "选择变化后触发" },
  { name: "clear", type: "() => void", desc: "清空时触发" },
  { name: "visible-change", type: "(visible) => void", desc: "展开状态变化" },
  { name: "expand-change", type: "(path) => void", desc: "展开层级变化" },
  { name: "focus / blur", type: "(event) => void", desc: "聚焦和失焦" },
  { name: "remove-tag", type: "(value) => void", desc: "移除多选标签" }
];

const methodsRows = [
  { name: "getCheckedNodes(leafOnly?)", desc: "获取当前选中节点快照" },
  { name: "clearCheckedNodes()", desc: "清空面板已选节点" },
  { name: "togglePopperVisible(visible?)", desc: "手动展开或收起下拉面板" },
  { name: "presentText()", desc: "读取当前回显文本" }
];

const panelPropsRows = [
  {
    name: "modelValue",
    type: "CascaderValue[] | CascaderValue[][]",
    default: "[]",
    desc: "当前选中路径"
  },
  { name: "options", type: "CascaderOption[]", default: "[]", desc: "级联选项树" },
  { name: "multiple / checkable", type: "boolean", default: "false", desc: "多选或复选框模式" },
  {
    name: "checkStrictly / emitPath / showPrefix",
    type: "boolean",
    default: "-",
    desc: "勾选联动与返回值控制"
  },
  { name: "height / itemSize", type: "number", default: "204 / 34", desc: "面板高度与行高" },
  { name: "props", type: "CascaderFieldNames", default: "-", desc: "字段名和勾选行为配置" }
];

useComponents({
  "page-cascader-ex1": PageCascaderEx1,
  "page-cascader-ex2": PageCascaderEx2,
  "page-cascader-ex3": PageCascaderEx3,
  "page-cascader-ex4": PageCascaderEx4,
  "page-cascader-ex5": PageCascaderEx5,
  "page-cascader-ex6": PageCascaderEx6,
  "page-cascader-ex7": PageCascaderEx7
});

const PageCascader = defineHtml(html`
  <elf-container>
    <h1>Cascader 级联选择器</h1>
    <p>从多级数据中逐级选择，适合地区、组织、分类等树状选项。</p>

    <page-cascader-ex1 />

    <page-cascader-ex2 />

    <page-cascader-ex3 />

    <page-cascader-ex4 />

    <page-cascader-ex5 />

    <page-cascader-ex6 />

    <page-cascader-ex7 />

    <h2>API</h2>
    <elf-props-table title="级联选择器属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="级联选择器事件" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="级联选择器方法" :rows=${methodsRows}></elf-props-table>
    <elf-props-table title="独立面板属性" :rows=${panelPropsRows}></elf-props-table>
  </elf-container>
`);

export { PageCascader };
