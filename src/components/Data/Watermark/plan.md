# Watermark Element Plus API 对齐计划

更新时间：2026-07-13

## 已完成

- [x] 核心 props：`content`、`image`、尺寸、旋转、层级、间距与偏移。
- [x] `font` 对象：`color`、`fontSize`、`fontWeight`、`fontStyle`、`fontFamily` 与 `textAlign`，并保持旧版 `font-size` / `font-color` 兼容。
- [x] 文字与图片水印、数组多行内容和默认 slot 承载内容。
- [x] 文档案例覆盖基础平铺与完整字体对象，PropsTable 同步。
- [x] 单测覆盖 SVG 背景、字体优先级和完整字体序列化。

## 后续项

- [ ] P1 `append-to`：需要在 Shadow DOM 外建立并同步定位的覆盖层，不能以移动宿主节点的方式伪实现。
- [ ] P2 `anti-tamper`：需要定义可恢复范围与 MutationObserver 的性能边界后再实现。

## 验收记录

- [x] `pnpm test src/components/Data/Watermark/Watermark.test.ts` 通过。
- [x] `pnpm build` 通过。
