# Empty Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Empty`
- Element Plus 文档：`empty.md`
- 实现原则：对齐 Element Plus Empty 的空状态展示 API，内部保持轻量 Web Components 实现。

## 第一批实现

- [x] 基础 props：`image`、`image-size`、`description`。
- [x] 基础 slot：`default`、`image`、`description`。
- [x] 注册到 Data 组件族并补单测。

## 后续差距

- [x] 2026-07-07 补独立案例页：覆盖基础空状态、自定义 `image`/`image-size`、`image`/`description` slots 和底部操作区。
- [ ] 增强默认插画样式和全局空状态 token。
- [ ] 页面示例补 Template / Script 双视图和 PropsTable。
