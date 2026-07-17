import { defineHtml, defineStyle, html, onMount, onUnmount, useRef } from "elfui";

import utilityStyles from "../../../styles/utilities.scss?inline";

interface UtilityCategory {
  title: string;
  description: string;
  previewClass: string;
  classes: string[];
  note: string;
}

const CATALOG = {
  borders: {
    title: "Borders 边框",
    description: "用逻辑方向类快速设置边框，并通过语义色 token 保持主题一致。",
    previewClass: "border border-primary rounded-lg pa-6",
    classes: ["border", "border-0", "border-t", "border-e", "border-b", "border-s", "border-primary", "border-success", "border-warning", "border-danger"],
    note: "s / e 分别表示 inline-start / inline-end，天然兼容 RTL。"
  },
  "border-radius": {
    title: "Border radius 边框半径",
    description: "从紧凑圆角到胶囊和圆形，统一复用 ElfUI radius token。",
    previewClass: "border rounded-xl pa-6",
    classes: ["rounded-0", "rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-pill", "rounded-circle", "rounded-t-lg"],
    note: "圆形元素请同时设置相等的宽高。"
  },
  content: {
    title: "Content 内容",
    description: "提供清除浮动、无障碍隐藏与媒体填充等内容辅助能力。",
    previewClass: "border rounded-lg pa-4 text-truncate w-50",
    classes: ["clearfix", "visually-hidden", "object-cover", "object-contain", "text-truncate"],
    note: "visually-hidden 会从视觉上隐藏内容，但仍保留给屏幕阅读器。"
  },
  cursor: {
    title: "Cursor 光标",
    description: "用明确光标表达元素的交互意图。",
    previewClass: "border rounded-lg pa-6 cursor-pointer",
    classes: ["cursor-auto", "cursor-default", "cursor-pointer", "cursor-move", "cursor-text", "cursor-wait", "cursor-not-allowed"],
    note: "光标只是反馈，不应代替 disabled、ARIA 或真实交互行为。"
  },
  display: {
    title: "Display 显示",
    description: "覆盖常见 display 值，并提供 sm / md / lg / xl 响应式前缀。",
    previewClass: "d-flex justify-space-between align-center border rounded-lg pa-6",
    classes: ["d-none", "d-block", "d-inline", "d-inline-block", "d-flex", "d-inline-flex", "d-grid", "d-table", "d-sm-flex", "d-md-grid", "d-lg-block"],
    note: "例如 d-none d-md-flex 表示中等及以上屏幕才显示为 flex。"
  },
  elevation: {
    title: "Elevation 高程",
    description: "0–24 级阴影表达界面层次，数值越高越接近用户。",
    previewClass: "elevation-12 rounded-lg pa-6",
    classes: ["elevation-0", "elevation-1", "elevation-2", "elevation-4", "elevation-8", "elevation-12", "elevation-16", "elevation-20", "elevation-24"],
    note: "优先使用少量固定层级，避免把阴影当作装饰。"
  },
  flex: {
    title: "Flex 弹性布局",
    description: "组合方向、换行、主轴、交叉轴、伸缩和排序辅助类。",
    previewClass: "d-flex justify-space-between align-center border rounded-lg pa-6",
    classes: ["flex-row", "flex-column", "flex-wrap", "flex-nowrap", "flex-grow-1", "flex-shrink-0", "justify-center", "justify-space-between", "align-center", "align-stretch", "order-first", "order-last"],
    note: "先用 d-flex 建立上下文，再组合 justify-* 与 align-*。"
  },
  float: {
    title: "Float 浮动",
    description: "为图文环绕等传统排版场景保留轻量浮动工具。",
    previewClass: "border rounded-lg pa-6 clearfix",
    classes: ["float-left", "float-right", "float-none", "clearfix"],
    note: "应用布局优先使用 Flex、Grid 或 Masonry，float 只用于内容环绕。"
  },
  opacity: {
    title: "Opacity 不透明度",
    description: "提供从 0 到 100 的常用透明度刻度。",
    previewClass: "border border-primary rounded-lg pa-6 opacity-50",
    classes: ["opacity-0", "opacity-10", "opacity-25", "opacity-50", "opacity-75", "opacity-90", "opacity-100"],
    note: "降低整个容器透明度也会影响文字；弱化文本优先使用语义色 token。"
  },
  overflow: {
    title: "Overflow 溢出",
    description: "分别控制整体、横向与纵向溢出行为。",
    previewClass: "overflow-auto border rounded-lg pa-6",
    classes: ["overflow-auto", "overflow-hidden", "overflow-visible", "overflow-scroll", "overflow-x-auto", "overflow-x-hidden", "overflow-y-auto", "overflow-y-hidden"],
    note: "可滚动区域应有可感知的尺寸边界，并保留键盘访问能力。"
  },
  position: {
    title: "Position 位置",
    description: "设置定位上下文与常用零偏移。",
    previewClass: "position-relative border rounded-lg pa-6",
    classes: ["position-static", "position-relative", "position-absolute", "position-fixed", "position-sticky", "top-0", "right-0", "bottom-0", "left-0", "inset-0"],
    note: "absolute 子元素通常需要最近祖先使用 position-relative。"
  },
  sizing: {
    title: "Sizing 缩放",
    description: "按百分比、视口和最大尺寸快速约束元素。",
    previewClass: "w-50 border border-primary rounded-lg pa-6",
    classes: ["w-0", "w-25", "w-50", "w-75", "w-100", "w-auto", "h-25", "h-50", "h-100", "mw-100", "mh-100", "vw-100", "vh-100"],
    note: "百分比高度只有在父容器高度明确时才会生效。"
  },
  spacing: {
    title: "Spacing 间距",
    description: "ma / pa 表示全部方向，x / y / t / e / b / s 表示逻辑方向。",
    previewClass: "ma-4 pa-6 border border-primary rounded-lg",
    classes: ["ma-0", "ma-4", "mx-auto", "mt-6", "me-2", "mb-4", "ms-2", "pa-4", "px-6", "py-2", "pt-8", "ma-n2"],
    note: "刻度 0–8 对应 0–32px；e / s 兼容 LTR 与 RTL。"
  },
  typography: {
    title: "Text and typography 文本和排版",
    description: "提供标题、正文、字重、对齐、大小写与截断能力。",
    previewClass: "text-h4 font-weight-medium text-center",
    classes: ["text-h1", "text-h2", "text-h3", "text-h4", "text-h5", "text-h6", "text-subtitle-1", "text-body-1", "text-body-2", "text-caption", "font-weight-bold", "text-center", "text-uppercase", "text-truncate"],
    note: "排版类只改变视觉层级，HTML 仍应使用正确的语义标签。"
  }
} satisfies Record<string, UtilityCategory>;

type UtilityKey = keyof typeof CATALOG;

const readCategory = (): UtilityKey => {
  if (typeof window === "undefined") return "borders";
  const key = window.location.hash.split("/").filter(Boolean).at(-1) as UtilityKey;
  return key in CATALOG ? key : "borders";
};

// State
const category = useRef<UtilityKey>(readCategory());
let removeHashListener = (): void => {};

// Derived state
const current = (): UtilityCategory => CATALOG[category.value];

// Lifecycle
onMount(() => {
  const syncCategory = () => category.set(readCategory());
  syncCategory();
  window.addEventListener("hashchange", syncCategory);
  removeHashListener = () => window.removeEventListener("hashchange", syncCategory);
});

onUnmount(() => removeHashListener());

defineStyle(utilityStyles);

const PageUtilities = defineHtml(html`
  <elf-container>
    <h1>${current().title}</h1>
    <p>${current().description}</p>

    <elf-playground :title=${current().title}>
      <span slot="status" class="demo-state">Light DOM helper classes</span>
      <div style="display:grid;gap:24px;width:100%">
        <div style="min-height:150px;display:grid;place-items:center;padding:24px;border-radius:20px;background:var(--elf-bg-overlay)">
          <div :class=${current().previewClass} style="max-width:520px;background:var(--elf-bg-paper);color:var(--elf-text-primary)">
            ElfUI utility preview · ${current().title}
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <code v-for="name in current().classes" :key="name" style="padding:7px 10px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-overlay);color:var(--elf-primary)">.${name}</code>
        </div>
      </div>
    </elf-playground>

    <elf-alert type="info" :title=${current().note}></elf-alert>
    <h2>使用方式</h2>
    <p>工具类随 ElfUI 全局样式发布，可直接用于应用的 Light DOM。组件内部采用 Shadow DOM 隔离，定制组件外观时请使用 Provider token、组件属性或公开的 CSS variables。</p>
  </elf-container>
`);

export { PageUtilities };
