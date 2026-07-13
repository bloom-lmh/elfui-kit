# Text Element Plus API 对标计划

## 本轮记录
- [x] 第二阶段：实现 `tag` 的常用标签渲染，并补 PropsTable 示例。
- [x] 第三阶段：tag 动态渲染已完整（v-if 链 8 种标签）；页面补 Script 视图；单测扩展到 15 条覆盖 type/size/truncated/lineClamp/mark/deleted/inserted/strong/italic/tag/part。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Text`
- Element Plus 文档：`text.md`、`typography.md`

## 第一批实现

- [x] 基础 props：`type`、`size`、`truncated`、`line-clamp`、`tag`、`mark`、`deleted`、`inserted`、`strong`、`italic`。
- [x] 默认 slot 承载文本内容。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 补独立案例页：覆盖语义类型、文本装饰、truncated 和 line-clamp 截断场景。
- [x] `tag` 动态标签渲染：span/p/div/strong/em/mark/del/ins 已全部实现。
- [ ] Typography 标题/段落组合组件：需产品设计（h1-h6 + paragraph 的组合语义），不在本轮实施。
