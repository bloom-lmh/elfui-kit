# Link Element Plus API 对标计划

## 本轮记录
- [x] 第二阶段：调整 icon slot 优先级高于 `icon` prop，并补 PropsTable 说明。
- [x] 第三阶段：复核 icon slot 优先级无误；页面示例补 Script 视图；单测扩展到 15 条覆盖 type/href/target/disabled/underline/icon/slot。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Link`
- Element Plus 文档：`link.md`
- 实现原则：对齐 Element Plus Link 的外部 API 与禁用/跳转语义，内部保持 ElfUI Web Components 与 `${...}` 模板写法。

## 第一批实现

- [x] 基础 props：`type`、`underline`、`disabled`、`href`、`target`、`icon`。
- [x] 基础 slot：`default`、`icon`。
- [x] 禁用态阻止跳转和 click 冒泡。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 补独立案例页：覆盖 `type`、`underline`、`disabled`、`href/target`、`icon` 属性和 `icon` 插槽。
- [x] 复核 Element Plus icon 对象/组件传入方式与 slot 优先级：slot 优先于 icon prop，符合预期。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。
