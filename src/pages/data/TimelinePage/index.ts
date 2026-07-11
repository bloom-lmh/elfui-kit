import { defineHtml, html, useComponents } from "elfui";
import { PageTimelineEx1 } from "./ex1";
import { PageTimelineEx2 } from "./ex2";
import { PageTimelineEx3 } from "./ex3";
import { PageTimelineEx4 } from "./ex4";
import { PageTimelineProps } from "./props";

useComponents({
  "page-timeline-ex1": PageTimelineEx1,
  "page-timeline-ex2": PageTimelineEx2,
  "page-timeline-ex3": PageTimelineEx3,
  "page-timeline-ex4": PageTimelineEx4,
  "page-timeline-props": PageTimelineProps
});

const PageTimeline = defineHtml(html`
  <elf-container
    ><h1>Timeline 时间轴</h1>
    <p>Material Design 风格时间轴，支持自定义颜色、图标、反转顺序。</p>
    <page-timeline-ex1 /><page-timeline-ex2 /><page-timeline-ex3 /><page-timeline-ex4 /><page-timeline-props
  /></elf-container>
`);

export { PageTimeline };
