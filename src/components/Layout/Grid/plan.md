# Grid Element Plus API 对标计划

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Layout/Grid`，对应 Element Plus `Row` 的布局职责。
- 保留 ElfUI 原生 `columns`、`gap`、`auto-fit` 与 `min-column-width` 能力。
- 采用固定 Custom Element 标签，Element Plus 的动态 `tag` 不适用于 ElfUI 组件模型。
- `span`、`offset`、`push`、`pull` 与响应式断点由 `GridItem` 负责。

## 完成情况

- [x] 补齐 `gutter`，并作为 `gap` 的兼容别名与优先配置。
- [x] 补齐 `justify`、`align` 布局属性及语义化宿主反射。
- [x] 默认插槽完成类型声明；无组件事件和 expose 方法。
- [x] 被动布局组件无需键盘、禁用、清空、受控状态或表单联动。
- [x] Props、类型导出、PropsTable 和页面案例同步。
- [x] 所有案例提供 Template / Script 双视图，动态值使用 `${...}`。
- [x] 增加 `gutter / justify / align`、自定义列数和自动适应案例。

## 架构说明

- 状态与归一化逻辑集中在组件头部，宿主 CSS 变量与属性反射集中声明，`defineHtml` 保持在末尾。
- 数字间距统一转换为非负 `px`，令属性值和属性绑定具有一致结果。
- Shadow DOM 只消费语义属性和私有 CSS 变量，不依赖外部选择器穿透。

## 验收记录

- [x] `Grid.test.ts` 4 项测试通过，覆盖默认值、动态列数、gutter 优先级和对齐同步。
- [x] 与 `GridItem.test.ts` 联合执行共 10 项测试通过。
- [x] `pnpm build` 通过。
- [x] Playwright 页面冒烟通过，案例显示 9 组 Template / Script 标签，控制台 0 error。
- [x] 浏览器计算样式验证 `gutter="16"` 得到 `gap: 16px`。
