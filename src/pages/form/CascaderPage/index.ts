import { defineHtml, html, useRef } from "elfui";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);
const clearableValue = useRef<string[]>([]);
const multipleValue = useRef<string[][]>([["zhejiang", "hangzhou"]]);
const checkableValue = useRef<string[][]>([["jiangsu", "nanjing"]]);
const panelValue = useRef<string[][]>([["zhejiang", "ningbo"]]);
const status = useRef("浙江 / 杭州");
const multipleStatus = useRef("浙江 / 杭州");
const checkableStatus = useRef("江苏 / 南京");
const panelStatus = useRef("浙江 / 宁波");

const options = [
  {
    label: "浙江",
    value: "zhejiang",
    children: [
      { label: "杭州", value: "hangzhou" },
      { label: "宁波", value: "ningbo" }
    ]
  },
  {
    label: "江苏",
    value: "jiangsu",
    children: [
      { label: "南京", value: "nanjing" },
      { label: "苏州", value: "suzhou" }
    ]
  },
  {
    label: "广东",
    value: "guangdong",
    children: [
      { label: "广州", value: "guangzhou" },
      { label: "深圳", value: "shenzhen", disabled: true }
    ]
  }
];

const code1 = `<elf-cascader
  :options.prop=\${options}
  :modelValue=\${value}
  @update:modelValue=\${onUpdate}
  @change=\${onChange}
/>`;

const script1 = `const value = useRef(["zhejiang", "hangzhou"]);
const status = useRef("浙江 / 杭州");

const options = [
  {
    label: "浙江",
    value: "zhejiang",
    children: [
      { label: "杭州", value: "hangzhou" },
      { label: "宁波", value: "ningbo" }
    ]
  },
  {
    label: "江苏",
    value: "jiangsu",
    children: [{ label: "南京", value: "nanjing" }]
  }
];

const onUpdate = (event) => {
  value.set(event.detail);
};

const onChange = (event) => {
  status.set(event.detail.path.join(" / ") || "未选择");
};`;

const code2 = `<elf-cascader
  :options.prop=\${options}
  :modelValue=\${clearableValue}
  clearable
  placeholder="请选择地区"
  @update:modelValue=\${onClearableUpdate}
/>`;

const script2 = `const clearableValue = useRef([]);

const onClearableUpdate = (event) => {
  clearableValue.set(event.detail);
};`;

const code3 = `<elf-cascader
  multiple
  clearable
  :options.prop=\${options}
  :modelValue=\${multipleValue}
  @update:modelValue=\${onMultipleUpdate}
  @change=\${onMultipleChange}
/>`;

const script3 = `const multipleValue = useRef([["zhejiang", "hangzhou"]]);
const multipleStatus = useRef("浙江 / 杭州");

const onMultipleUpdate = (event) => {
  multipleValue.set(event.detail);
};

const onMultipleChange = (event) => {
  multipleStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
};`;

const code4 = `<elf-cascader
  checkable
  clearable
  :options.prop=\${options}
  :modelValue=\${checkableValue}
  @update:modelValue=\${onCheckableUpdate}
  @change=\${onCheckableChange}
/>`;

const script4 = `const checkableValue = useRef([["jiangsu", "nanjing"]]);
const checkableStatus = useRef("江苏 / 南京");

const onCheckableUpdate = (event) => {
  checkableValue.set(event.detail);
};

const onCheckableChange = (event) => {
  checkableStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
};`;

const code5 = `<elf-cascader-panel
  checkable
  :options.prop=\${options}
  :modelValue=\${panelValue}
  @update:modelValue=\${onPanelUpdate}
  @change=\${onPanelChange}
/>`;

const script5 = `const panelValue = useRef([["zhejiang", "ningbo"]]);
const panelStatus = useRef("浙江 / 宁波");

const onPanelUpdate = (event) => {
  panelValue.set(event.detail);
};

const onPanelChange = (event) => {
  panelStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
};`;

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
    desc: "过滤能力预留"
  },
  { name: "separator", type: "string", default: "' / '", desc: "回显路径分隔符" },
  { name: "props", type: "CascaderFieldNames", default: "-", desc: "自定义字段名" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "选中路径变化" },
  { name: "change", type: "({ value, path, selected, multiple }) => void", desc: "选择变化后触发" },
  { name: "clear", type: "() => void", desc: "清空时触发" },
  { name: "visible-change", type: "(visible) => void", desc: "展开状态变化" },
  { name: "expand-change", type: "(path) => void", desc: "展开层级变化" },
  { name: "focus / blur", type: "(event) => void", desc: "聚焦和失焦" }
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

const joinPaths = (paths: unknown): string => {
  if (!Array.isArray(paths)) return "未选择";
  if (paths.length === 0) return "未选择";
  if (Array.isArray(paths[0])) {
    return (paths as string[][]).map((path) => path.join(" / ")).join("、") || "未选择";
  }
  return (paths as string[]).join(" / ") || "未选择";
};

const onUpdate = (event: CustomEvent): void => {
  value.set(event.detail as string[]);
};

const onClearableUpdate = (event: CustomEvent): void => {
  clearableValue.set(event.detail as string[]);
};

const onMultipleUpdate = (event: CustomEvent): void => {
  multipleValue.set(event.detail as string[][]);
};

const onCheckableUpdate = (event: CustomEvent): void => {
  checkableValue.set(event.detail as string[][]);
};

const onPanelUpdate = (event: CustomEvent): void => {
  panelValue.set(event.detail as string[][]);
};

const onChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[] };
  status.set(joinPaths(detail.path));
};

const onMultipleChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  multipleStatus.set(joinPaths(detail.path));
};

const onCheckableChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  checkableStatus.set(joinPaths(detail.path));
};

const onPanelChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  panelStatus.set(joinPaths(detail.path));
};

const PageCascader = defineHtml(html`
  <elf-container>
    <h1>Cascader 级联选择器</h1>
    <p>从多级数据中逐级选择，适合地区、组织、分类等树状选项。</p>

    <elf-playground title="基础用法" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;width:260px">
        <elf-cascader
          :options.prop=${options}
          :modelValue=${value}
          @update:modelValue=${onUpdate}
          @change=${onChange}
        ></elf-cascader>
        <span class="demo-state">当前路径：{{ status }}</span>
      </div>
    </elf-playground>

    <elf-playground title="可清空 / 禁用项" :code=${code2} :script=${script2}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div style="width:260px">
          <elf-cascader
            :options.prop=${options}
            :modelValue=${clearableValue}
            clearable
            placeholder="请选择地区"
            @update:modelValue=${onClearableUpdate}
          ></elf-cascader>
        </div>
        <div style="width:260px">
          <elf-cascader :options.prop=${options} disabled placeholder="禁用状态"></elf-cascader>
        </div>
      </div>
    </elf-playground>

    <elf-playground title="多选" :code=${code3} :script=${script3}>
      <div style="display:grid;gap:12px;width:320px">
        <elf-cascader
          multiple
          clearable
          :options.prop=${options}
          :modelValue=${multipleValue}
          @update:modelValue=${onMultipleUpdate}
          @change=${onMultipleChange}
        ></elf-cascader>
        <span class="demo-state">当前路径：{{ multipleStatus }}</span>
      </div>
    </elf-playground>

    <elf-playground title="选项框" :code=${code4} :script=${script4}>
      <div style="display:grid;gap:12px;width:320px">
        <elf-cascader
          checkable
          clearable
          :options.prop=${options}
          :modelValue=${checkableValue}
          @update:modelValue=${onCheckableUpdate}
          @change=${onCheckableChange}
        ></elf-cascader>
        <span class="demo-state">当前路径：{{ checkableStatus }}</span>
      </div>
    </elf-playground>

    <elf-playground title="CascaderPanel 选项面板" :code=${code5} :script=${script5}>
      <div style="display:grid;gap:12px;width:max-content">
        <elf-cascader-panel
          checkable
          :options.prop=${options}
          :modelValue=${panelValue}
          @update:modelValue=${onPanelUpdate}
          @change=${onPanelChange}
        ></elf-cascader-panel>
        <span class="demo-state">当前路径：{{ panelStatus }}</span>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Cascader Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Cascader Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Cascader Exposes" :rows=${methodsRows}></elf-props-table>
    <elf-props-table title="CascaderPanel Props" :rows=${panelPropsRows}></elf-props-table>
  </elf-container>
`);

export { PageCascader };
