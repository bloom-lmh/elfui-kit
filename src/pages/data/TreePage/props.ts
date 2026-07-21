import { defineHtml, html } from "@elfui/core";

const propsRows = [
  { name: "data", type: "TreeNode[]", default: "[]", desc: "树形数据源" },
  {
    name: "node-key",
    type: "string",
    default: "''",
    desc: "节点唯一标识字段，优先级高于 props.key"
  },
  { name: "model-value", type: "string", default: "''", desc: "当前选中节点 key" },
  {
    name: "current-node-key",
    type: "string",
    default: "''",
    desc: "Element Plus 风格的当前高亮节点 key"
  },
  { name: "default-selected-key", type: "string", default: "''", desc: "非受控初始选中节点" },
  {
    name: "expanded-keys",
    type: "string[]",
    default: "undefined",
    desc: "受控展开节点 key 数组"
  },
  { name: "checked-keys", type: "string[]", default: "undefined", desc: "受控勾选节点 key 数组" },
  { name: "default-expanded-keys", type: "string[]", default: "[]", desc: "非受控初始展开节点" },
  { name: "default-checked-keys", type: "string[]", default: "[]", desc: "非受控初始勾选节点" },
  {
    name: "props",
    type: "TreeFieldNames",
    default: "{}",
    desc: "字段别名，支持 key/label/children/disabled/isLeaf/icon"
  },
  { name: "show-checkbox", type: "boolean", default: "false", desc: "显示复选框" },
  { name: "check-strictly", type: "boolean", default: "false", desc: "父子节点勾选互不关联" },
  { name: "highlight-current", type: "boolean", default: "true", desc: "是否高亮当前选中节点" },
  { name: "accordion", type: "boolean", default: "false", desc: "同级只保留一个展开分支" },
  {
    name: "default-expand-all",
    type: "boolean",
    default: "false",
    desc: "初始展开全部可展开节点"
  },
  {
    name: "expand-on-click-node",
    type: "boolean",
    default: "true",
    desc: "点击节点内容时展开或收起"
  },
  {
    name: "check-on-click-node",
    type: "boolean",
    default: "false",
    desc: "点击节点内容时同步勾选"
  },
  { name: "filterable", type: "boolean", default: "false", desc: "显示过滤输入框" },
  {
    name: "filter-placeholder",
    type: "string",
    default: "'搜索节点'",
    desc: "过滤输入框占位文本"
  },
  { name: "empty-text", type: "string", default: "'暂无数据'", desc: "空状态文本" },
  { name: "indent", type: "number", default: "20", desc: "层级缩进像素" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(key: string) => void", desc: "选中节点变化时触发" },
  { name: "update:expandedKeys", type: "(keys: string[]) => void", desc: "展开节点变化时触发" },
  { name: "update:checkedKeys", type: "(keys: string[]) => void", desc: "勾选节点变化时触发" },
  { name: "node-click", type: "(node, key, viewNode) => void", desc: "点击可用节点时触发" },
  { name: "node-expand", type: "(node, key, expandedKeys) => void", desc: "节点展开时触发" },
  { name: "node-collapse", type: "(node, key, expandedKeys) => void", desc: "节点收起时触发" },
  { name: "check", type: "(node, checkedKeys) => void", desc: "勾选状态变化时触发" },
  {
    name: "check-change",
    type: "(node, checked, checkedKeys) => void",
    desc: "单个节点勾选变化时触发"
  }
];

const methodsRows = [
  { name: "expand(key)", type: "(key: string) => void", desc: "展开节点" },
  { name: "collapse(key)", type: "(key: string) => void", desc: "收起节点" },
  { name: "toggle(key)", type: "(key: string) => void", desc: "切换展开状态" },
  { name: "select(key)", type: "(key: string) => void", desc: "选中节点" },
  { name: "check(key)", type: "(key: string) => void", desc: "勾选节点" },
  { name: "uncheck(key)", type: "(key: string) => void", desc: "取消勾选节点" },
  {
    name: "setChecked(key, checked, deep)",
    type: "(string, boolean, boolean?) => void",
    desc: "设置单个节点勾选状态，deep 控制是否级联后代"
  },
  {
    name: "setCheckedKeys(keys, leafOnly)",
    type: "(string[], boolean?) => void",
    desc: "批量设置勾选节点 key，权限树回显常用"
  },
  {
    name: "setCheckedNodes(nodes, leafOnly)",
    type: "(TreeNode[], boolean?) => void",
    desc: "按节点数据批量设置勾选状态"
  },
  {
    name: "getCheckedKeys(leafOnly)",
    type: "(boolean?) => string[]",
    desc: "获取已勾选节点 key，可只取叶子节点"
  },
  {
    name: "getCheckedNodes(leafOnly, includeHalfChecked)",
    type: "(boolean?, boolean?) => TreeNode[]",
    desc: "获取已勾选节点数据，可包含半选节点"
  },
  { name: "getHalfCheckedKeys()", type: "() => string[]", desc: "获取半选节点 key" },
  { name: "getHalfCheckedNodes()", type: "() => TreeNode[]", desc: "获取半选节点数据" },
  { name: "setCurrentKey(key)", type: "(key: string) => void", desc: "设置当前高亮节点" },
  {
    name: "setCurrentNode(node)",
    type: "(node: TreeNode | null) => void",
    desc: "按节点数据设置当前高亮节点"
  },
  { name: "getCurrentKey()", type: "() => string", desc: "获取当前高亮节点 key" },
  { name: "getCurrentNode()", type: "() => TreeNode | undefined", desc: "获取当前高亮节点数据" },
  {
    name: "getNode(key)",
    type: "(keyOrNode: string | TreeNode) => TreeNode | undefined",
    desc: "按 key 或节点数据获取节点数据"
  },
  { name: "filter(keyword)", type: "(keyword: string) => void", desc: "主动过滤节点" }
];

const PageTreeProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="Events" :rows="eventsRows" />
  <elf-props-table title="Methods" :rows="methodsRows" />
`);

export { PageTreeProps };
