import { defineHtml, html, useComponents } from "elfui";

import { PageDatePickerEx1 } from "./ex1";
import { PageDatePickerEx2 } from "./ex2";
import { PageDatePickerEx3 } from "./ex3";
import { PageDatePickerEx4 } from "./ex4";
import { PageDatePickerEx5 } from "./ex5";

const propsRows = [
  { name: "variant / label", type: "default | outlined | underlined | solo | solo-filled | solo-inverted / string", default: "filled / ''", desc: "输入表面与浮动标签" },
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

useComponents({
  "page-date-picker-ex1": PageDatePickerEx1,
  "page-date-picker-ex2": PageDatePickerEx2,
  "page-date-picker-ex3": PageDatePickerEx3,
  "page-date-picker-ex4": PageDatePickerEx4,
  "page-date-picker-ex5": PageDatePickerEx5
});

const PageDatePicker = defineHtml(html`
  <elf-container>
    <h1>DatePicker 日期选择器</h1>
    <p>用于单日期、日期范围、月份和多日期选择；需要明确提交的场景可以开启动作栏。</p>

    <page-date-picker-ex1 />

    <page-date-picker-ex2 />

    <page-date-picker-ex3 />

    <page-date-picker-ex4 />

    <page-date-picker-ex5 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
    <elf-props-table title="Events" :rows="eventRows"></elf-props-table>
  </elf-container>
`);

export { PageDatePicker };
