# 统一字段 Variant 升级计划

## 目标

让文本输入、文本域、下拉选择、自动补全、级联选择和 Picker 触发字段共享一致的 Vuetify 风格表面语义，同时保持 ElfUI Custom Element、Shadow DOM、表单状态和旧代码兼容性。

## API 契约

- [x] 支持 `default`、`outlined`、`underlined`、`solo`、`solo-filled`、`solo-inverted`。
- [x] 保留 `filled`，作为 `default` 的兼容别名。
- [x] 由 `FieldVariant` 和 `normalizeFieldVariant` 统一类型与非法值回退。
- [x] 焦点、展开、错误、禁用和暗色模式由共享 field-surface mixin 统一处理。

## 组件落地

- [x] Input
- [x] Textarea
- [x] Select
- [x] Autocomplete
- [x] Cascader
- [x] DatePicker
- [x] TimePicker
- [x] ColorPicker

## 验收

- [x] Input 提供六种 variant 的可复制 Playground 案例与 Props 文档。
- [x] Select、Textarea、Autocomplete、Cascader 的 Props 文档同步公共契约。
- [x] 每个接入组件覆盖六种表面值的 host 反射测试。
- [x] 核心表单测试、Picker 测试、生产构建和真实浏览器浅色/暗色视觉回归通过。
