import { defineHtml, html, useRef } from "elfui";

const date = useRef("2026-06-17");
const month = useRef("2026-06");
const start = useRef("2026-06-01");
const end = useRef("2026-06-30");
const dates = useRef<string[]>(["2026-06-10", "2026-06-14"]);
const actionValue = useRef("2026-06-12");

const shortcuts = [
  { label: "今天", value: "2026-06-17" },
  { label: "本月", value: "2026-06-01", endValue: "2026-06-30" },
  { label: "下周一", value: "2026-06-22" }
];

const readDetail = <T>(event: Event, fallback: T): T =>
  ((event as CustomEvent).detail ?? fallback) as T;

const updateDate = (event: Event): void => {
  date.set(String(readDetail(event, "")));
};

const updateMonth = (event: Event): void => {
  month.set(String(readDetail(event, "")));
};

const updateStart = (event: Event): void => {
  start.set(String(readDetail(event, "")));
};

const updateEnd = (event: Event): void => {
  end.set(String(readDetail(event, "")));
};

const updateDates = (event: Event): void => {
  const detail = readDetail<unknown>(event, []);
  dates.set(Array.isArray(detail) ? detail.map(String) : []);
};

const updateAction = (event: Event): void => {
  actionValue.set(String(readDetail(event, "")));
};

const basicCode = `<elf-date-picker
  model-value="2026-06-17"
  clearable
/>`;

const rangeCode = `<elf-date-picker
  model-value="2026-06-01"
  end-value="2026-06-30"
  range
  clearable
  :shortcuts.prop="shortcuts"
/>`;

const monthCode = `<elf-date-picker
  type="month"
  show-header
  header="选择账期"
/>`;

const multipleCode = `<elf-date-picker
  multiple
  clearable
  :modelValue.prop="dates"
/>`;

const actionsCode = `<elf-date-picker
  actions
  clearable
  show-header
  header="带确认的日期选择"
/>`;

const propsRows = [
  { name: "modelValue", type: "string | string[]", default: "''", desc: "当前值，多选时为数组" },
  { name: "endValue", type: "string", default: "''", desc: "范围选择的结束值" },
  {
    name: "type",
    type: "date | datetime-local | month | week",
    default: "date",
    desc: "原生日期输入类型"
  },
  { name: "range", type: "boolean", default: "false", desc: "开启开始/结束范围选择" },
  { name: "multiple", type: "boolean", default: "false", desc: "开启多日期选择" },
  { name: "actions", type: "boolean", default: "false", desc: "显示确认/取消动作栏" },
  { name: "show-header", type: "boolean", default: "false", desc: "显示顶部摘要" },
  { name: "header", type: "string", default: "''", desc: "自定义顶部标题" },
  { name: "min / max", type: "string", default: "''", desc: "可选范围" },
  { name: "shortcuts", type: "DateShortcut[]", default: "[]", desc: "快捷项" },
  { name: "clearable", type: "boolean", default: "false", desc: "允许清空" }
];

const eventRows = [
  { name: "update:modelValue", type: "string | string[]", desc: "值更新" },
  { name: "update:endValue", type: "string", desc: "范围结束值更新" },
  { name: "change", type: "string | string[]", desc: "选择变化" },
  { name: "confirm", type: "string | string[]", desc: "动作栏确认" },
  { name: "cancel", type: "void", desc: "动作栏取消" },
  { name: "clear", type: "void", desc: "清空" }
];

const selectedDates = (): string => dates.value.join("，") || "暂无";

const PageDatePicker = defineHtml(html`
  <elf-container>
    <h1>DatePicker 日期选择器</h1>
    <p>用于单日期、日期范围、月份和多日期选择；需要明确提交的场景可以开启动作栏。</p>

    <elf-playground title="基础日期" :code="basicCode">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue="date"
          clearable
          @update:modelValue="updateDate"
        ></elf-date-picker>
        <span class="demo-state">{{ date }}</span>
      </div>
    </elf-playground>

    <elf-playground title="范围与快捷项" :code="rangeCode">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue="start"
          :endValue="end"
          range
          clearable
          :shortcuts.prop="shortcuts"
          @update:modelValue="updateStart"
          @update:endValue="updateEnd"
        ></elf-date-picker>
        <span class="demo-state">{{ start }} 至 {{ end }}</span>
      </div>
    </elf-playground>

    <elf-playground title="月份与头部" :code="monthCode">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <elf-date-picker
          :modelValue="month"
          type="month"
          show-header
          header="选择账期"
          @update:modelValue="updateMonth"
        ></elf-date-picker>
        <span class="demo-state">{{ month }}</span>
      </div>
    </elf-playground>

    <elf-playground title="多日期" :code="multipleCode">
      <div style="display:grid;gap:12px;max-width:620px">
        <elf-date-picker
          multiple
          clearable
          :modelValue.prop="dates"
          @update:modelValue="updateDates"
        ></elf-date-picker>
        <span class="demo-state">已选：{{ selectedDates() }}</span>
      </div>
    </elf-playground>

    <elf-playground title="动作栏确认" :code="actionsCode">
      <div style="display:grid;gap:12px;max-width:620px">
        <elf-date-picker
          :modelValue="actionValue"
          actions
          clearable
          show-header
          header="带确认的日期选择"
          @update:modelValue="updateAction"
        ></elf-date-picker>
        <span class="demo-state">提交值：{{ actionValue }}</span>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Events" :rows="eventRows"></elf-props-table>
  </elf-container>
`);

export { PageDatePicker };
