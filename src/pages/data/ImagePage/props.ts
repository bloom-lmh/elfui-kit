import { defineHtml, html } from "@elfui/core";

const propsRows = [
  { name: "src", type: "string", default: "''", desc: "图片资源地址" },
  { name: "alt", type: "string", default: "''", desc: "图片替代文本" },
  { name: "fit", type: "fill | contain | cover | none | scale-down", default: "fill", desc: "对应 object-fit 的填充方式" },
  { name: "width / height", type: "number | string", default: "auto", desc: "数字按 px 处理，也支持任意 CSS 尺寸" },
  { name: "lazy", type: "boolean", default: "false", desc: "进入视口前不设置 src" },
  { name: "preview-src-list", type: "string[]", default: "[]", desc: "非空时允许点击预览" },
  { name: "initial-index", type: "number", default: "0", desc: "预览打开时的初始图片索引" },
  { name: "preview-teleported", type: "boolean", default: "false", desc: "将预览层传送到 document.body" },
  { name: "zoom-rate", type: "number", default: "1.2", desc: "单次缩放倍率，最小为 1.05" },
  { name: "toolbar", type: "boolean", default: "true", desc: "显示缩放与重置工具栏" }
];

const eventsRows = [
  { name: "load", type: "(event: Event) => void", desc: "底层图片加载完成" },
  { name: "error", type: "(event: Event) => void", desc: "底层图片加载失败" },
  { name: "preview-open", type: "(index: number) => void", desc: "预览打开" },
  { name: "preview-close", type: "(index: number) => void", desc: "预览关闭" },
  { name: "preview-change", type: "(index: number) => void", desc: "预览图片切换" }
];

const slotsRows = [{ name: "error", desc: "图片加载失败时的替代内容" }];

const PageImageProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} />
  <elf-props-table title="Events" :rows.prop=${eventsRows} />
  <elf-props-table title="Slots" :rows.prop=${slotsRows} />
`);

export { PageImageProps };
