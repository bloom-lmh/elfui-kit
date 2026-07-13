# Collapse Element Plus API 对齐计划

更新时间：2026-07-13

## 已完成

- [x] 数据驱动 props：`model-value`、`accordion`、`items` 与字段映射 `props`。
- [x] Events：`update:modelValue` 与 `change`。
- [x] 数据驱动项支持禁用、受控同步、手风琴输出、原生 button 键盘访问和 button/region ARIA 关联。
- [x] 新增 `<elf-collapse-item>` 组合式子组件，支持 `name`、`title`、`disabled`、`default` / `title` / `icon` slots 和 `toggle()` 方法。
- [x] 父组件统一协调数据模式和子组件模式；子项不会自行持有与 `model-value` 冲突的状态。
- [x] 文档包含数据驱动、accordion、字段映射与组合式子项案例，PropsTable 同步。
- [x] 单测覆盖数据模式、禁用、受控同步、子项协同、slots、expose 和 ARIA。

## 验收记录

- [x] `pnpm test src/components/Data/Collapse/Collapse.test.ts src/components/Data/CollapseItem/CollapseItem.test.ts` 通过。
- [x] `pnpm build` 通过。
