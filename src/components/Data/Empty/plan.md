# Empty Element Plus API 对齐计划

更新时间：2026-07-13

- [x] Props：`image`、`image-size`、`description`。
- [x] Slots：`default`、`image`、`description`。
- [x] 默认状态使用可主题化 SVG 插画；`--elf-empty-illustration` 与 `--elf-empty-illustration-accent` 支持明暗主题覆盖。
- [x] 自定义图片会替换默认插画，默认插画对辅助技术隐藏。
- [x] 文档覆盖默认、插槽及图片场景，PropsTable 同步。
- [x] 单测覆盖尺寸、默认插画、图片切换与 slots。

## 验收记录

- [x] `pnpm test src/components/Data/Empty/Empty.test.ts` 通过。
- [x] `pnpm build` 通过。
