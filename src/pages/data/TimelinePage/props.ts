import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "items", type: "TimelineItem[]", default: "[]", desc: "时间轴数据" },
  { name: "mode", type: "left | alternate | horizontal", default: "left", desc: "排列模式" },
  { name: "reverse", type: "boolean", default: "false", desc: "反转顺序" }
];

const itemRows = [
  { name: "timestamp", type: "string", desc: "右侧时间标签" },
  { name: "title", type: "string", desc: "右侧标题" },
  { name: "content", type: "string", desc: "右侧内容描述" },
  { name: "timestamp2", type: "string", desc: "左侧时间标签（side=both/left 时）" },
  { name: "title2", type: "string", desc: "左侧标题" },
  { name: "content2", type: "string", desc: "左侧内容描述" },
  { name: "icon", type: "string", desc: "节点图标" },
  {
    name: "color",
    type: "primary | success | warning | danger | info",
    default: "primary",
    desc: "节点颜色"
  },
  { name: "side", type: "left | right | both", default: "right", desc: "信息显示侧（both 双侧）" }
];

const PageTimelineProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="TimelineItem" :rows="itemRows" />
`);

export { PageTimelineProps };
