import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "effect", type: "slide | fade", default: "slide", desc: "过渡效果" },
  { name: "autoplay", type: "boolean", default: "true", desc: "自动播放" },
  { name: "interval", type: "number", default: "4000", desc: "间隔 ms" },
  { name: "loop", type: "boolean", default: "true", desc: "无限循环" },
  {
    name: "show-arrow",
    type: "circle | square | ghost | false",
    default: "circle",
    desc: "箭头样式"
  },
  { name: "show-indicator", type: "boolean", default: "true", desc: "显示指示器" },
  { name: "indicator-type", type: "dot | line | number", default: "dot", desc: "指示器样式" },
  { name: "height", type: "string", default: "'320px'", desc: "轮播高度" },
  { name: "duration", type: "string", default: "'0.5s'", desc: "过渡时长" },
  { name: "pause-on-hover", type: "boolean", default: "true", desc: "悬停暂停" },
  { name: "radius", type: "string", default: "'12px'", desc: "圆角" }
];

const eventsRows = [{ name: "change", type: "(index: number) => void", desc: "切换时触发" }];

const PageCarouselProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" /><elf-props-table
    title="Events"
    :rows="eventsRows"
  />
`);

export { PageCarouselProps };
