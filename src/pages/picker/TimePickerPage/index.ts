import { defineHtml, html, useRef } from "elfui";

const time = useRef("09:30");

const rangeValue = useRef<[string, string]>(["09:00", "18:00"]);

const fallbackTime = useRef("12:30");

const visibleLog = useRef("等待聚焦");

const shortcuts = [
  { label: "上午", value: "09:00", endValue: "12:00" },
  { label: "工作日", value: "09:00", endValue: "18:00" },
  { label: "晚上", value: "19:00", endValue: "22:00" }
];

const updateTime = (event: CustomEvent): void => {
  time.set(String(event.detail));
};

const updateRange = (event: CustomEvent): void => {
  rangeValue.set((event.detail ?? ["", ""]) as [string, string]);
};

const updateFallback = (event: CustomEvent): void => {
  fallbackTime.set(String(event.detail || ""));
};

const clearFallback = (): string => "09:00";

const onVisibleChange = (event: CustomEvent): void => {
  visibleLog.set(event.detail ? "面板已打开" : "面板已关闭");
};

const rangeText = (): string =>
  `${rangeValue.value[0] || "--:--"} 至 ${rangeValue.value[1] || "--:--"}`;

const singleCode = `<elf-time-picker
  :modelValue=\${time}
  :step=\${300}
  clearable
  @update:modelValue=\${updateTime}
/>`;

const singleScript = `const time = useRef("09:30");

const updateTime = (event) => {
  time.set(event.detail);
};`;

const rangeCode = `<elf-time-picker
  :modelValue=\${rangeValue}
  is-range
  start-placeholder="开始时间"
  end-placeholder="结束时间"
  range-separator="到"
  :shortcuts.prop=\${shortcuts}
  @update:modelValue=\${updateRange}
/>`;

const rangeScript = `const rangeValue = useRef(["09:00", "18:00"]);

const shortcuts = [
  { label: "上午", value: "09:00", endValue: "12:00" },
  { label: "工作日", value: "09:00", endValue: "18:00" },
  { label: "晚上", value: "19:00", endValue: "22:00" }
];

const updateRange = (event) => {
  rangeValue.set(event.detail);
};`;

const controlCode = `<elf-time-picker
  :modelValue=\${fallbackTime}
  min="09:00"
  max="18:00"
  size="lg"
  :editable=\${false}
  :value-on-clear.prop=\${clearFallback}
  @update:modelValue=\${updateFallback}
  @visible-change=\${onVisibleChange}
/>`;

const controlScript = `const fallbackTime = useRef("12:30");
const visibleLog = useRef("等待聚焦");

const clearFallback = () => "09:00";

const updateFallback = (event) => {
  fallbackTime.set(event.detail || "");
};

const onVisibleChange = (event) => {
  visibleLog.set(event.detail ? "面板已打开" : "面板已关闭");
};`;

const propsRows = [
  {
    name: "modelValue",
    type: "string | [string, string]",
    default: "''",
    desc: "当前时间；范围模式可传数组"
  },
  { name: "endValue", type: "string", default: "''", desc: "兼容单独结束时间绑定" },
  { name: "range / isRange", type: "boolean", default: "false", desc: "范围选择" },
  { name: "min / max", type: "string", default: "''", desc: "可选时间范围" },
  { name: "step", type: "number", default: "60", desc: "秒级步进" },
  {
    name: "readonly / editable",
    type: "boolean",
    default: "false / true",
    desc: "只读或禁止手动输入"
  },
  { name: "size", type: "sm | md | lg", default: "md", desc: "尺寸" },
  {
    name: "placeholder / startPlaceholder / endPlaceholder",
    type: "string",
    default: "-",
    desc: "占位文本"
  },
  { name: "rangeSeparator", type: "string", default: "至", desc: "范围分隔符" },
  { name: "shortcuts", type: "TimeShortcut[]", default: "[]", desc: "快捷项" },
  { name: "clearable", type: "boolean", default: "true", desc: "可清空" },
  {
    name: "valueOnClear",
    type: "string | [string, string] | Function",
    default: "-",
    desc: "清空后的值"
  },
  { name: "id / name / tabindex", type: "string | number", default: "-", desc: "原生表单属性" }
];

const eventsRows = [
  { name: "update:modelValue", type: "(value) => void", desc: "值变化" },
  { name: "update:endValue", type: "(value) => void", desc: "结束值变化" },
  { name: "change", type: "(value) => void", desc: "提交变化" },
  { name: "clear", type: "() => void", desc: "清空" },
  { name: "focus / blur", type: "(event) => void", desc: "聚焦和失焦" },
  { name: "visible-change", type: "(visible) => void", desc: "面板显示状态变化" }
];

const methodsRows = [
  { name: "focus()", desc: "聚焦开始输入框" },
  { name: "blur()", desc: "移除焦点" },
  { name: "handleOpen()", desc: "手动标记打开状态" },
  { name: "handleClose()", desc: "手动标记关闭状态" }
];

const PageTimePicker = defineHtml(html`
  <elf-container>
    <h1>TimePicker 时间选择器</h1>
    <p>支持单时间、时间范围、步进、最小最大值、快捷项和清空。</p>
    <elf-playground title="单时间" :code=${singleCode} :script=${singleScript}>
      <div style="display:grid;gap:16px;width:100%;max-width:820px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-time-picker
            :modelValue=${time}
            :step=${300}
            clearable
            @update:modelValue=${updateTime}
          ></elf-time-picker>
          <span class="demo-state">{{ time }}</span>
        </div>
      </div>
    </elf-playground>

    <elf-playground title="is-range + 数组值 + 快捷项" :code=${rangeCode} :script=${rangeScript}>
      <div style="display:grid;gap:16px;width:100%;max-width:820px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-time-picker
            :modelValue=${rangeValue}
            is-range
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            range-separator="到"
            :shortcuts.prop=${shortcuts}
            clearable
            @update:modelValue=${updateRange}
          ></elf-time-picker>
          <span class="demo-state">{{ rangeText() }}</span>
        </div>
      </div>
    </elf-playground>

    <elf-playground
      title="限制范围 / 不可编辑 / value-on-clear"
      :code=${controlCode}
      :script=${controlScript}
    >
      <div style="display:grid;gap:12px;width:100%;max-width:820px">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-time-picker
            :modelValue=${fallbackTime}
            min="09:00"
            max="18:00"
            size="lg"
            :editable=${false}
            :valueOnClear.prop=${clearFallback}
            @update:modelValue=${updateFallback}
            @visible-change=${onVisibleChange}
          ></elf-time-picker>
          <span class="demo-state">{{ fallbackTime }} / {{ visibleLog }}</span>
        </div>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
  </elf-container>
`);

export { PageTimePicker };
