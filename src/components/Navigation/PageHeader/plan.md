# PageHeader Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/PageHeader`
- Element Plus 文档：`page-header.md`

## 第一批实现

- [x] 基础 props：`title`、`content`、`icon`。
- [x] 基础 event：`back`。
- [x] 基础 slots：`icon`、`title`、`content`、`extra`。

## 后续差距

- [x] 对齐 breadcrumb slot、默认图标策略和导航示例。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、back 事件和 icon/title/content/extra 插槽示例。
## 本轮记录

- [x] 2026-07-11 Navigation 第一阶段：补 `breadcrumb` slot、默认图标策略复核、breadcrumb 示例和 Props/Events/Slots 表，新增 slot 单测。
- [x] 2026-07-15 验收：7 项组件测试通过；浏览器验证 2 个 PageHeader 案例、2 个 Script 视图和 `back` 事件状态，控制台无错误。
