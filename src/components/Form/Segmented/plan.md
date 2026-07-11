# Segmented Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Segmented`
- Element Plus 文档：`segmented.md`

## 第一批实现

- [x] 基础 props：`model-value`、`options`、`size`、`disabled`、`block`、`props`。
- [x] 基础 events：`update:modelValue`、`change`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 2026-07-07 补独立案例页：覆盖受控 `modelValue`、对象/字符串 `options`、禁用项、`block` 和 `size`。
- [ ] 补齐自定义 option slot、name/id、validate-event 等细节。
- [ ] 页面示例补 Template / Script 双视图和 PropsTable。
