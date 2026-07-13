import { defineHtml, html, useRef } from "elfui";

const day = useRef("2026-07-07");
const workday = useRef("2026-07-07");
const selectedRange = useRef<[string, string]>(["2026-07-08", "2026-07-12"]);
const weekendDisabled = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;
const onDayUpdate = (event: CustomEvent): void => day.set(String(event.detail || ""));
const onWorkdayUpdate = (event: CustomEvent): void => workday.set(String(event.detail || ""));
const onRangeUpdate = (event: CustomEvent): void => {
  if (Array.isArray(event.detail) && event.detail.length === 2) selectedRange.set([String(event.detail[0]), String(event.detail[1])]);
};

const basicCode = `<elf-calendar :modelValue.prop="day" @update:modelValue="onDayUpdate" />`;
const basicScript = `const day = useRef("2026-07-07");`;
const localeCode = `<elf-calendar
  :modelValue.prop="workday"
  locale="zh-CN"
  :first-day-of-week="1"
  :disabled-date.prop="weekendDisabled"
  aria-label="工作日历"
  @update:modelValue="onWorkdayUpdate"
/>`;
const localeScript = `const workday = useRef("2026-07-07");
const weekendDisabled = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;`;
const rangeCode = `<elf-calendar range :modelValue.prop="selectedRange" @update:modelValue="onRangeUpdate" />`;
const rangeScript = `const selectedRange = useRef(["2026-07-08", "2026-07-12"]);`;

const PageCalendar = defineHtml(html`
  <elf-container>
    <h1>Calendar 日历</h1>
    <p>展示月视图日期选择，支持受控值、首日设置、翻月、本地化周标题和禁用日期。</p>
    <elf-playground title="受控日期" :code=${basicCode} :script=${basicScript}>
      <elf-calendar :modelValue=${day} @update:modelValue=${onDayUpdate}></elf-calendar>
      <span class="demo-state">选中：{{ day.value }}</span>
    </elf-playground>
    <elf-playground title="本地化、翻月与禁用日期" :code=${localeCode} :script=${localeScript}>
      <elf-calendar
        :modelValue=${workday}
        locale="zh-CN"
        :first-day-of-week=${1}
        :disabled-date=${weekendDisabled}
        aria-label="工作日历"
        @update:modelValue=${onWorkdayUpdate}
      ></elf-calendar>
      <span class="demo-state">周末不可选；可使用标题两侧按钮翻月。</span>
    </elf-playground>
    <elf-playground title="范围选择" :code=${rangeCode} :script=${rangeScript}>
      <elf-calendar range :modelValue=${selectedRange} @update:modelValue=${onRangeUpdate}></elf-calendar>
      <span class="demo-state">范围：{{ selectedRange.value.join(" 至 ") }}</span>
    </elf-playground>
  </elf-container>
`);

export { PageCalendar };
