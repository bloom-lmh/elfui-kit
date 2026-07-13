# Segmented Element Plus API 对齐计划

更新时间：2026-07-13

- [x] 核心 props：`model-value`、`options`、`size`、`disabled`、`block`、字段映射与表单校验开关。
- [x] Events：`update:modelValue`、`change`。
- [x] 可访问性：`name`、`id`、`aria-label`、`label`、radiogroup/radio 语义和 roving tabindex。
- [x] 键盘：方向键、Home、End 会跳过禁用项，并保持受控模型与即时选中态同步。
- [x] 文档覆盖受控、禁用、尺寸、block、标签与键盘使用方式。
- [x] 单测覆盖选择、禁用、ARIA、roving tabindex、方向键和受控同步。

## 后续项

- [ ] P2 作用域 `option` slot：需要先在宏模板中定义并验证跨重复项的 slot scope 约定后提供。

## 验收记录

- [x] `pnpm test src/components/Form/Segmented/Segmented.test.ts` 通过。
- [x] `pnpm build` 通过。
