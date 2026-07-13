import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "items", type: "TimelineItem[]", default: "[]", desc: "时间轴数据" },
  { name: "mode", type: "start | end | alternate | alternate-reverse", default: "start", desc: "Element Plus 对齐排列模式" },
  { name: "reverse", type: "boolean", default: "false", desc: "反转顺序" }
];

const itemRows = [
  { name: "timestamp", type: "string", desc: "时间标签" },
  { name: "hide-timestamp", type: "boolean", default: "false", desc: "隐藏时间标签" },
  { name: "placement", type: "top | bottom", default: "bottom", desc: "时间标签位置" },
  { name: "center", type: "boolean", default: "false", desc: "节点垂直居中" },
  { name: "title", type: "string", desc: "右侧标题" },
  { name: "content", type: "string", desc: "右侧内容描述" },
  { name: "timestamp2", type: "string", desc: "左侧时间标签（side=both/left 时）" },
  { name: "title2", type: "string", desc: "左侧标题" },
  { name: "content2", type: "string", desc: "左侧内容描述" },
  { name: "type", type: "primary | success | warning | danger | info", desc: "节点语义类型" },
  { name: "icon", type: "string", desc: "节点图标" },
  {
    name: "color",
    type: "primary | success | warning | danger | info",
    default: "primary",
    desc: "节点颜色"
  },
  { name: "size", type: "normal | large", default: "normal", desc: "节点尺寸" },
  { name: "hollow", type: "boolean", default: "false", desc: "空心节点" },
  { name: "side", type: "left | right | both", default: "right", desc: "信息显示侧（both 双侧）" }
];

const PageTimelineProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows" />
  <elf-props-table title="TimelineItem" :rows="itemRows" />
`);

export { PageTimelineProps };
