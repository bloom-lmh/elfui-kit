export interface UtilityGroup {
  title: string;
  pattern: string;
  values: string;
  responsive?: boolean;
  examples: string[];
}

export interface UtilityCategory {
  title: string;
  eyebrow: string;
  description: string;
  note: string;
  code: string;
  groups: UtilityGroup[];
}

export const BREAKPOINTS = [
  { name: "xs", range: "0–599.98px", min: "0" },
  { name: "sm", range: "600–839.98px", min: "600px" },
  { name: "md", range: "840–1144.98px", min: "840px" },
  { name: "lg", range: "1145–1544.98px", min: "1145px" },
  { name: "xl", range: "1545–2137.98px", min: "1545px" },
  { name: "xxl", range: "≥ 2138px", min: "2138px" }
] as const;

export const CATALOG = {
  borders: {
    title: "Borders 边框",
    eyebrow: "SURFACE DEFINITION",
    description: "完整对齐 Vuetify 4 的边框宽度、逻辑方向、透明度与线型工具类。",
    note: "s / e 使用逻辑方向，在 LTR 与 RTL 下会自动翻转；语义颜色类是 ElfUI 的兼容扩展。",
    code: `<div class="border border-md border-primary rounded-lg pa-6">Primary surface</div>`,
    groups: [
      { title: "宽度", pattern: ".border-{size}", values: "0, thin, sm, md, lg, xl", examples: ["border", "border-0", "border-md", "border-xl"] },
      { title: "方向", pattern: ".border-{side}-{size}", values: "t, e, b, s × width", examples: ["border-t", "border-e-lg", "border-b-md", "border-s-0"] },
      { title: "透明度与线型", pattern: ".border-{modifier}", values: "opacity 0–100, solid, dashed, dotted, double, none", examples: ["border-opacity-25", "border-dashed", "border-double", "border-current"] }
    ]
  },
  "border-radius": {
    title: "Border radius 边框半径",
    eyebrow: "SHAPE SYSTEM",
    description: "覆盖全部圆角尺度、四条逻辑边与四个逻辑角，保持 RTL 方向正确。",
    note: "sm / md / lg / xl 是圆角尺度，不是响应式断点；circle 适合等宽高元素。",
    code: `<div class="rounded-xl pa-6">Rounded surface</div>`,
    groups: [
      { title: "尺度", pattern: ".rounded-{size}", values: "0, sm, md, lg, xl, pill, circle, shaped", examples: ["rounded-0", "rounded-sm", "rounded-lg", "rounded-pill", "rounded-shaped"] },
      { title: "边", pattern: ".rounded-{side}-{size}", values: "t, e, b, s", examples: ["rounded-t-xl", "rounded-e-lg", "rounded-b-0", "rounded-s-pill"] },
      { title: "角", pattern: ".rounded-{corner}-{size}", values: "ts, te, be, bs", examples: ["rounded-ts-xl", "rounded-te-lg", "rounded-be-0", "rounded-bs-sm"] }
    ]
  },
  content: {
    title: "Content 内容",
    eyebrow: "ACCESSIBLE CONTENT",
    description: "提供屏幕阅读器、事件穿透、对象填充和清除浮动等内容辅助能力。",
    note: "d-sr-only 只在视觉上隐藏内容；pointer-pass-through 允许容器穿透，但子元素仍可交互。",
    code: `<a class="d-sr-only-focusable" href="#content">Skip to content</a>`,
    groups: [
      { title: "无障碍", pattern: ".d-sr-only{-focusable}", values: "screen reader only", examples: ["d-sr-only", "d-sr-only-focusable", "visually-hidden"] },
      { title: "指针事件", pattern: ".pointer-{mode}", values: "events-none, events-auto, pass-through", examples: ["pointer-events-none", "pointer-events-auto", "pointer-pass-through"] },
      { title: "内容适配", pattern: ".object-{fit}", values: "cover, contain", examples: ["object-cover", "object-contain", "clearfix"] }
    ]
  },
  cursor: {
    title: "Cursor 光标",
    eyebrow: "INTERACTION INTENT",
    description: "对齐 Vuetify 的完整光标集合，用视觉反馈表达元素的交互意图。",
    note: "光标不能代替 disabled、焦点管理和 ARIA 状态。",
    code: `<button class="cursor-pointer">Open details</button>`,
    groups: [
      { title: "光标", pattern: ".cursor-{value}", values: "auto, default, pointer, wait, text, move, help, not-allowed, progress, grab, grabbing, none", examples: ["cursor-pointer", "cursor-grab", "cursor-progress", "cursor-not-allowed", "cursor-help"] }
    ]
  },
  display: {
    title: "Display 显示",
    eyebrow: "RESPONSIVE VISIBILITY",
    description: "覆盖 Vuetify display、hidden、print 与屏幕阅读器类，并补充 Grid 兼容扩展。",
    note: "响应式类从指定断点向上生效，例如 d-none d-md-flex。",
    code: `<div class="d-none d-md-flex">Visible from md</div>`,
    groups: [
      { title: "Display", pattern: ".d-{breakpoint?}-{value}", values: "none, inline, inline-block, block, table, table-row, table-cell, flex, inline-flex", responsive: true, examples: ["d-none", "d-flex", "d-md-inline-flex", "d-xxl-table"] },
      { title: "条件隐藏", pattern: ".hidden-{range}", values: "xs…xxl, *-and-up, *-and-down, print-only, screen-only", examples: ["hidden-xs", "hidden-md-and-up", "hidden-lg-and-down", "hidden-print-only"] },
      { title: "打印", pattern: ".d-print-{value}", values: "all display values", examples: ["d-print-none", "d-print-block", "d-print-table", "d-print-flex"] }
    ]
  },
  elevation: {
    title: "Elevation 高程",
    eyebrow: "MATERIAL DEPTH",
    description: "采用 Vuetify 4 的 0–5 双层阴影和 hover 高程，并保留 6–24 旧版兼容。",
    note: "新项目优先使用 0–5；6–24 仅用于避免现有 ElfUI 页面发生破坏性变化。",
    code: `<div class="elevation-3 hover-elevation-5 rounded-lg pa-6">Hover me</div>`,
    groups: [
      { title: "高程", pattern: ".elevation-{level}", values: "0–5", examples: ["elevation-0", "elevation-1", "elevation-2", "elevation-3", "elevation-4", "elevation-5"] },
      { title: "悬浮高程", pattern: ".hover-elevation-{level}", values: "0–5", examples: ["hover-elevation-1", "hover-elevation-3", "hover-elevation-5", "elevation-overlay"] }
    ]
  },
  flex: {
    title: "Flex 弹性布局",
    eyebrow: "RESPONSIVE COMPOSITION",
    description: "完整覆盖 flex 简写、方向、换行、对齐、伸缩、顺序以及所有响应式变体。",
    note: "先使用 d-flex 建立格式化上下文，再组合方向、对齐、gap 和伸缩工具。",
    code: `<div class="d-flex flex-column flex-md-row ga-4 align-center">
  <div class="flex-grow-1">Main</div><div>Action</div>
</div>`,
    groups: [
      { title: "Flex 简写", pattern: ".flex-{breakpoint?}-{grow}-{shrink}-{basis}", values: "fill, 1-1, 1-0, 0-1, 0-0, *-100, *-0", responsive: true, examples: ["flex-fill", "flex-1-0-100", "flex-md-1-1-0", "flex-xxl-0-0"] },
      { title: "方向与换行", pattern: ".flex-{breakpoint?}-{value}", values: "row, column, reverse, wrap, nowrap", responsive: true, examples: ["flex-column", "flex-md-row", "flex-wrap", "flex-lg-nowrap"] },
      { title: "对齐", pattern: ".justify-* / .align-*", values: "start, end, center, baseline, stretch, space-*", responsive: true, examples: ["justify-space-between", "align-center", "align-content-md-space-evenly", "align-self-lg-end"] },
      { title: "伸缩与顺序", pattern: ".flex-*-grow-* / .order-*", values: "grow/shrink 0–1, order first/0–12/last", responsive: true, examples: ["flex-grow-1", "flex-md-shrink-0", "order-first", "order-lg-12"] }
    ]
  },
  float: {
    title: "Float 浮动",
    eyebrow: "EDITORIAL FLOW",
    description: "支持物理与逻辑方向、所有断点和打印环境，适合图文环绕。",
    note: "应用布局优先使用 Flex、Grid 或 Masonry；Float 主要服务编辑型内容。",
    code: `<img class="float-start me-4 mb-2" alt="" />`,
    groups: [
      { title: "浮动", pattern: ".float-{breakpoint?}-{value}", values: "none, left, right, start, end", responsive: true, examples: ["float-start", "float-end", "float-md-left", "float-xxl-none"] },
      { title: "打印", pattern: ".float-print-{value}", values: "none, left, right, start, end", examples: ["float-print-left", "float-print-end", "float-print-none", "clearfix"] }
    ]
  },
  opacity: {
    title: "Opacity 不透明度",
    eyebrow: "STATE EMPHASIS",
    description: "覆盖 0–100 十级刻度以及 Material 状态透明度。",
    note: "opacity 会影响整个子树；弱化文本优先使用 text-medium-emphasis 或 text-disabled。",
    code: `<div class="opacity-60">Secondary surface</div>`,
    groups: [
      { title: "数值", pattern: ".opacity-{value}", values: "0, 10, 20 … 100", examples: ["opacity-0", "opacity-20", "opacity-40", "opacity-60", "opacity-80", "opacity-100"] },
      { title: "状态", pattern: ".opacity-{state}", values: "hover, focus, selected, activated, pressed, dragged", examples: ["opacity-hover", "opacity-focus", "opacity-selected", "opacity-dragged"] }
    ]
  },
  overflow: {
    title: "Overflow 溢出",
    eyebrow: "CONTENT BOUNDARIES",
    description: "分别控制整体、横向和纵向溢出行为，与 Vuetify 官方值保持一致。",
    note: "可滚动区域应提供明确尺寸，并确保键盘用户能够进入和离开。",
    code: `<div class="overflow-x-auto">…</div>`,
    groups: [
      { title: "整体", pattern: ".overflow-{value}", values: "auto, hidden, visible, scroll", examples: ["overflow-auto", "overflow-hidden", "overflow-visible", "overflow-scroll"] },
      { title: "轴向", pattern: ".overflow-{axis}-{value}", values: "x/y × auto/hidden/scroll", examples: ["overflow-x-auto", "overflow-x-scroll", "overflow-y-hidden", "overflow-y-scroll"] }
    ]
  },
  position: {
    title: "Position 位置",
    eyebrow: "SPATIAL ANCHORING",
    description: "提供完整 position 值和四个零偏移辅助类。",
    note: "absolute 子元素通常需要最近祖先使用 position-relative。",
    code: `<div class="position-relative">
  <span class="position-absolute top-0 right-0">New</span>
</div>`,
    groups: [
      { title: "定位", pattern: ".position-{value}", values: "static, relative, fixed, absolute, sticky", examples: ["position-static", "position-relative", "position-absolute", "position-fixed", "position-sticky"] },
      { title: "偏移", pattern: ".{edge}-0", values: "top, right, bottom, left", examples: ["top-0", "right-0", "bottom-0", "left-0", "inset-0"] }
    ]
  },
  sizing: {
    title: "Sizing 缩放",
    eyebrow: "RESPONSIVE DIMENSIONS",
    description: "按 Vuetify 4 的百分比、auto 和 viewport 高度生成响应式宽高类。",
    note: "百分比高度只有在父容器高度明确时才有效；h-screen 使用动态视口单位 dvh。",
    code: `<div class="w-100 w-md-50 h-screen">Responsive panel</div>`,
    groups: [
      { title: "宽度", pattern: ".w-{breakpoint?}-{value}", values: "auto, 0, 25, 33, 50, 66, 75, 100", responsive: true, examples: ["w-25", "w-33", "w-md-50", "w-xxl-100"] },
      { title: "高度", pattern: ".h-{breakpoint?}-{value}", values: "auto, screen, 0, 25, 50, 75, 100", responsive: true, examples: ["h-auto", "h-screen", "h-md-50", "h-xl-100"] },
      { title: "兼容辅助", pattern: ".{dimension}-100", values: "fill-height, mw, mh, vw, vh, min-vw, min-vh", examples: ["fill-height", "mw-100", "mh-100", "vw-100", "min-vh-100"] }
    ]
  },
  spacing: {
    title: "Spacing 间距",
    eyebrow: "4PX SPACING SYSTEM",
    description: "0–16 的 4px 刻度，完整覆盖 margin、padding、gap、负值、auto 与所有断点。",
    note: "x / y 使用物理轴，s / e 使用逻辑方向；负值只用于 margin。",
    code: `<div class="d-flex flex-column flex-md-row ga-4 pa-6 ma-md-2">
  <div class="pa-4">A</div><div class="pa-4">B</div>
</div>`,
    groups: [
      { title: "Margin", pattern: ".m{a|x|y|t|r|b|l|s|e}-{breakpoint?}-{value}", values: "0–16, n1–n16, auto", responsive: true, examples: ["ma-4", "mx-auto", "mt-n3", "me-md-8", "ml-xxl-16"] },
      { title: "Padding", pattern: ".p{a|x|y|t|r|b|l|s|e}-{breakpoint?}-{value}", values: "0–16", responsive: true, examples: ["pa-4", "px-8", "py-md-6", "ps-lg-12", "pr-xxl-16"] },
      { title: "Gap", pattern: ".g{a|r|c}-{breakpoint?}-{value}", values: "0–16, auto", responsive: true, examples: ["ga-4", "gr-8", "gc-md-6", "ga-xl-12", "gc-xxl-auto"] }
    ]
  },
  typography: {
    title: "Text and typography 文本和排版",
    eyebrow: "MATERIAL 3 TYPE SCALE",
    description: "使用 Vuetify 4 / Material 3 的 15 级排版，同时保留 Vuetify 2 标题别名。",
    note: "排版类改变视觉层级而不改变 HTML 语义；标题仍应使用正确的 h1–h6 标签。",
    code: `<h1 class="text-display-small text-md-display-large">Product vision</h1>
<p class="text-body-large text-medium-emphasis">Description</p>`,
    groups: [
      { title: "Material 3", pattern: ".text-{breakpoint?}-{role}-{size}", values: "display/headline/title/body/label × large/medium/small", responsive: true, examples: ["text-display-large", "text-headline-small", "text-title-medium", "text-body-large", "text-label-small"] },
      { title: "对齐与换行", pattern: ".text-{breakpoint?}-{value}", values: "left/right/center/justify/start/end, wrap, no-wrap, truncate, break", responsive: true, examples: ["text-center", "text-md-start", "text-no-wrap", "text-truncate", "text-break"] },
      { title: "字重与装饰", pattern: ".font-* / .text-decoration-*", values: "thin…black, italic, underline, overline, line-through", examples: ["font-weight-semibold", "font-weight-black", "font-italic", "text-decoration-underline", "text-mono"] },
      { title: "强调与变换", pattern: ".text-{value}", values: "high/medium emphasis, disabled, uppercase/lowercase/capitalize/none", examples: ["text-high-emphasis", "text-medium-emphasis", "text-disabled", "text-uppercase", "text-none"] }
    ]
  }
} satisfies Record<string, UtilityCategory>;

export type UtilityKey = keyof typeof CATALOG;
