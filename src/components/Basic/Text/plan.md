# Text Element Plus API 对标计划

## 本轮记录
- [x] 第四阶段：补 Element Plus 标准 size、字符串 line-clamp、b/i/sub/sup 标签；以 h1-h6/p 语义 tag 完成标题段落组合，并保留 sm/md/lg 兼容别名。
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
- [x] Typography 标题/段落组合：不新增重复组件，统一由 Text 的 h1-h6/p 语义 `tag`、`size` 与 `strong` 组合完成，并提供独立案例。
