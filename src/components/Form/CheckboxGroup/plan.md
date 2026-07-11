# CheckboxGroup Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/CheckboxGroup`
- Element Plus 文档：`checkbox.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### checkbox.md

#### Checkbox API

- `model-value / v-model`
- `value ^`
- `label`
- `true-value ^`
- `false-value ^`
- `disabled`
- `border`
- `size`
- `checked`
- `indeterminate`
- `validate-event`
- `tabindex`
- `id`
- `aria-controls ^ ^`
- `aria-label ^`
- `true-label ^`
- `false-label ^`
- `controls ^ ^`
- `change`
- `default`

#### Checkbox Attributes

- `model-value / v-model`
- `value ^`
- `label`
- `true-value ^`
- `false-value ^`
- `disabled`
- `border`
- `size`
- `checked`
- `indeterminate`
- `validate-event`
- `tabindex`
- `id`
- `aria-controls ^ ^`
- `aria-label ^`
- `true-label ^`
- `false-label ^`
- `controls ^ ^`

#### Checkbox Events

- `change`

#### Checkbox Slots

- `default`

#### CheckboxGroup API

- `model-value / v-model`
- `size`
- `disabled`
- `min`
- `max`
- `aria-label ^ ^`
- `text-color`
- `fill`
- `tag`
- `validate-event`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`
- `change`
- `default`

#### CheckboxGroup Attributes

- `model-value / v-model`
- `size`
- `disabled`
- `min`
- `max`
- `aria-label ^ ^`
- `text-color`
- `fill`
- `tag`
- `validate-event`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`

#### CheckboxGroup Events

- `change`

#### CheckboxGroup Slots

- `default`

#### CheckboxButton API

- `value ^`
- `label`
- `true-value ^`
- `false-value ^`
- `disabled`
- `checked`
- `true-label ^`
- `false-label ^`
- `default`

#### CheckboxButton Attributes

- `value ^`
- `label`
- `true-value ^`
- `false-value ^`
- `disabled`
- `checked`
- `true-label ^`
- `false-label ^`

#### CheckboxButton Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `disabled`
- `max`
- `min`
- `modelValue`
- `size`

### Events

- `change`
- `update:modelValue`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`value ^`、`label`、`true-value ^`、`false-value ^`、`border`、`checked`、`indeterminate`、`validate-event`、`tabindex`、`id`、`aria-controls ^ ^`、`aria-label ^`、`true-label ^`、`false-label ^`、`controls ^ ^`、`aria-label ^ ^`、`text-color`、`fill`、`tag`、`label ^ ^`、`options ^`、`props ^`、`type ^`
- [ ] P0 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
- [ ] P1 补齐插槽/暴露方法：当前粗扫未发现明显缺口，进入实现时复核默认插槽、命名插槽和 expose 方法。
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# CheckboxGroup 复选框组组件开发与重构计划

## 1. 目标定位

提供支持管理多个 `Checkbox` 子组件的组合包装容器。支持统一管理子组件的选中状态、大小、禁用状态，以及最大/最小选中数限制，并且无缝接入 `Form` 与 `FormItem` 校验流程。

## 2. 计划与重构任务

- [x] **2.1 上下文注入与多实例兼容**: 采用全局共享 `Symbol.for("elfui.provides.checkbox-group")` 作为注入键值，保证在 monorepo 局部多实例打包中子组件能 100% 正确连通 `CheckboxGroup` 状态。
- [x] **2.2 组级别禁用和尺寸联动**: 自动继承外层 `Form` 或自身的禁用和尺寸设置，通过 `provide` 向下透传给 `Checkbox` 子组件。
- [x] **2.3 最大/最小选择控制**: 支持配置 `min` 和 `max` 属性，限制子组件的选中总数。
- [x] **2.4 校验事件触发**: 选中值变更时，同步触发 `update:modelValue` 与 `change` 事件，供 `FormItem` 收集校验触发。
