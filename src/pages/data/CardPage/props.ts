import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "header", type: "string", default: "''", desc: "卡片头部文本（header slot 优先）" },
  { name: "footer", type: "string", default: "''", desc: "卡片底部文本（footer slot 优先）" },
  { name: "body-style", type: "object", default: "{}", desc: "主体区域内联样式" },
  { name: "header-class", type: "string", default: "''", desc: "头部自定义 class" },
  { name: "body-class", type: "string", default: "''", desc: "主体自定义 class" },
  { name: "footer-class", type: "string", default: "''", desc: "底部自定义 class" },
  { name: "shadow", type: "always | hover | never", default: "always", desc: "阴影显示时机" },
  {
    name: "variant",
    type: "elevated | outlined | filled",
    default: "elevated",
    desc: "MD3 变体"
  },
  { name: "avatar", type: "string", default: "''", desc: "头像图片地址" },
  { name: "title", type: "string", default: "''", desc: "标题文本" },
  { name: "subtitle", type: "string", default: "''", desc: "副标题（标题下方小字）" },
  { name: "image", type: "string", default: "''", desc: "封面图片地址" },
  { name: "image-placement", type: "top | left", default: "top", desc: "图片位置" },
  { name: "image-height", type: "string", default: "200px", desc: "图片高度（top 模式）" },
  { name: "image-width", type: "string", default: "40%", desc: "图片宽度（left 模式）" },
  { name: "overlay", type: "string", default: "''", desc: "图片底部叠加文字" },
  {
    name: "clickable",
    type: "boolean",
    default: "false",
    desc: "是否可点击，hover 时上升 + 阴影"
  }
];

const eventsRows = [{ name: "click", type: "() => void", desc: "clickable 时整卡点击触发" }];

const slotsRows = [
  { name: "default", desc: "卡片主体内容" },
  { name: "cover", desc: "封面区域（与 image prop 共用容器）" },
  { name: "title", desc: "自定义标题" },
  { name: "extra", desc: "头部右侧额外内容" },
  { name: "header", desc: "完全自定义头部，优先于 header prop" },
  { name: "footer", desc: "底部操作栏，优先于 footer prop" }
];

const PageCardProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows} /><elf-props-table
    title="Events"
    :rows.prop=${eventsRows}
  /><elf-props-table title="Slots" :rows.prop=${slotsRows} />
`);

export { PageCardProps };
