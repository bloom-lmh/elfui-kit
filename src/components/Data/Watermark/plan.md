# Watermark Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Watermark`
- Element Plus 文档：`watermark.md`

## 第一批实现

- [x] 基础 props：`content`、`image`、`width`、`height`、`rotate`、`z-index`、`gap-x`、`gap-y`、`offset-x`、`offset-y`、`font-size`、`font-color`。
- [x] 默认 slot 承载水印覆盖内容。
- [x] 注册到 Data 组件族并补单测。

## 后续差距

- [ ] 补齐 font 对象配置、append-to、anti-tamper 等高级能力。
- [ ] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖文字水印、多行 content、尺寸、间距、旋转角度和颜色示例。
