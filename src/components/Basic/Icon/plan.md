# Icon Element Plus API 对标计划

## 本轮记录
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
- [ ] SVG 图标库 / icon collection：需要产品决策（内置 SVG sprite 还是依赖外部图标库、按需引入还是全量打包），暂不在此阶段实施。
- [x] 页面示例补 Script 视图和 PropsTable。
