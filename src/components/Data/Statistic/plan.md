# Statistic Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Statistic`
- Element Plus 文档：`statistic.md`

## 第一批实现

- [x] 基础 props：`value`、`title`、`prefix`、`suffix`、`precision`、`group-separator`、`decimal-separator`。
- [x] 基础 slots：`title`、`prefix`、`suffix`。
- [x] 注册到 Data 组件族并补单测。

## 后续差距

- [ ] 补齐 formatter、value-style、Countdown 子能力。`formatter`、`value-style` 已完成；Countdown 作为独立的时间驱动组件能力待实现。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template、基础数值、precision、prefix/suffix、分隔符和 slots 示例。
