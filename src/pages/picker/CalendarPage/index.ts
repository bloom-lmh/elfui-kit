import { defineHtml, html, useRef } from "elfui";

const day = useRef("2026-07-07");
const mondayDay = useRef("2026-07-07");

const code1 = `<elf-calendar
  :modelValue=\${day}
  @update:modelValue=\${onDayUpdate}
/>
<span class="demo-state">选中：\${day}</span>`;

const script1 = `const day = useRef("2026-07-07");

const onDayUpdate = (event) => {
  day.set(event.detail);
};`;

const code2 = `<elf-calendar
  :modelValue=\${mondayDay}
  :first-day-of-week=\${1}
  @update:modelValue=\${onMondayUpdate}
>
  <strong slot="header">工作日视图</strong>
</elf-calendar>`;

const script2 = `const mondayDay = useRef("2026-07-07");`;

const onDayUpdate = (event: CustomEvent): void => {
  day.set(String(event.detail || ""));
};

const onMondayUpdate = (event: CustomEvent): void => {
  mondayDay.set(String(event.detail || ""));
};

const PageCalendar = defineHtml(html`
  <elf-container>
    <h1>Calendar 日历</h1>
    <p>展示月视图日期选择，支持受控值、首日设置和 header 插槽。</p>

    <elf-playground title="受控日期" :code=${code1} :script=${script1}>
      <elf-calendar :modelValue=${day} @update:modelValue=${onDayUpdate}></elf-calendar>
      <span class="demo-state">选中：${day}</span>
    </elf-playground>

    <elf-playground title="first-day-of-week / header slot" :code=${code2} :script=${script2}>
      <elf-calendar
        :modelValue=${mondayDay}
        :first-day-of-week=${1}
        @update:modelValue=${onMondayUpdate}
      >
        <strong slot="header">工作日视图</strong>
      </elf-calendar>
    </elf-playground>
  </elf-container>
`);

export { PageCalendar };
