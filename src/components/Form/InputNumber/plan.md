# InputNumber Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/InputNumber`
- Element Plus 文档：`input-number.md`

## 第一批实现

- [x] 基础 props：`model-value`、`min`、`max`、`step`、`step-strictly`、`precision`、`disabled`、`readonly`、`controls`、`controls-position`、`size`、`placeholder`、`name`。
- [x] 基础 events：`update:modelValue`、`change`、`input`、`focus`、`blur`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 2026-07-07 补独立案例页：覆盖受控值、`min/max/step`、`precision`、`step-strictly`、`controls-position`、禁用/只读/无控制按钮。
- [ ] 补齐 `value-on-clear`、`validate-event`、原生 ARIA 细节、`focus`/`blur` 代理和 FormItem 校验联动。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。
