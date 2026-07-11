# Text Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Text`
- Element Plus 文档：`text.md`、`typography.md`

## 第一批实现

- [x] 基础 props：`type`、`size`、`truncated`、`line-clamp`、`tag`、`mark`、`deleted`、`inserted`、`strong`、`italic`。
- [x] 默认 slot 承载文本内容。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 2026-07-07 补独立案例页：覆盖语义类型、文本装饰、`truncated` 和 `line-clamp` 截断场景。
- [ ] `tag` 当前保留为 API，后续补动态标签渲染。
- [ ] 补齐 Typography 标题/段落组合组件边界。
