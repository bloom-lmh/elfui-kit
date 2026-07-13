# Calendar Element Plus API 对齐计划

更新时间：2026-07-13

- [x] 单日期 `model-value`、`first-day-of-week`、`update:modelValue`、`change` 和 header slot。
- [x] 月份导航：默认 header 提供上/下月按钮。
- [x] `disabled-date`、`locale` 和 `aria-label`，日期网格有 button/grid 语义。
- [x] 文档展示受控日期、本地化、禁用日期与翻月。
- [x] 单测覆盖月份网格、事件、本地化、禁用与翻月。

## 后续项

- [x] P0 范围选择：首击记录半选状态，第二击提交排序后的 `[start, end]`，并渲染起点、终点与区间。
- [ ] P1 `date-cell` 作用域插槽：需要先验证宏模板的循环 slot scope 协议。

## 验收记录

- [x] `pnpm test src/components/Picker/Calendar/Calendar.test.ts` 通过。
- [x] `pnpm build` 通过。
