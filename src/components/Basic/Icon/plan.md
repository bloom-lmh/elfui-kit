# Icon Element Plus API 对标计划

## 本轮记录
- [x] 第四阶段：确定图标集合采用独立包 / 默认插槽按需引入策略，核心组件不全量内置 SVG；补 `loading` / `is-loading` 旋转、减少动态效果兼容、案例与测试。
- [x] 第二阶段：补 `aria-label` 可访问性属性和页面 PropsTable。
- [x] 第三阶段：页面补 Script 视图；单测扩展到 10 条覆盖 name/size/color/CSS 变量/aria-label/role/slot/part。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Icon`
- Element Plus 文档：`icon.md`

## 第一批实现

- [x] 基础 props：`name`、`size`、`color`。
- [x] 默认 slot 承载自定义图标内容。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 补独立案例页：覆盖 `name`、`size`、`color` 属性和默认插槽。
- [x] SVG 图标库 / icon collection：对齐 Element Plus 的拆包方式，核心包只提供图标容器；图标通过默认插槽按需引入，未来集合以独立包发布，避免全量 SVG 进入主包。
- [x] 页面示例补 Script 视图和 PropsTable。
