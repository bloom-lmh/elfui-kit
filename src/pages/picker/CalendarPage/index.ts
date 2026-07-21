import { defineHtml, html, useComponents } from "@elfui/core";

import { PageCalendarEx1 } from "./ex1";
import { PageCalendarEx2 } from "./ex2";
import { PageCalendarEx3 } from "./ex3";

useComponents({
  "page-calendar-ex1": PageCalendarEx1,
  "page-calendar-ex2": PageCalendarEx2,
  "page-calendar-ex3": PageCalendarEx3
});

const PageCalendar = defineHtml(html`
  <elf-container>
    <h1>Calendar 日历</h1>
    <p>展示月视图日期选择，支持年 / 月层级切换、翻月、本地化周标题和禁用日期。</p>
    <page-calendar-ex1 />
    <page-calendar-ex2 />
    <page-calendar-ex3 />
  </elf-container>
`);

export { PageCalendar };
