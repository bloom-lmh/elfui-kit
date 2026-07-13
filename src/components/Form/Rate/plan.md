# Rate Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Rate`
- Element Plus 文档：`rate.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### rate.md

#### API

- `model-value / v-model`
- `max`
- `size`
- `disabled`
- `allow-half`
- `low-threshold`
- `high-threshold`
- `colors`
- `void-color`
- `disabled-void-color`
- `icons`
- `void-icon`
- `disabled-void-icon`
- `show-text`
- `show-score`
- `text-color`
- `texts`
- `score-template`
- `clearable ^`
- `id`
- `aria-label ^ ^`
- `label ^ ^`
- `change`
- `setCurrentValue`
- `resetCurrentValue`

#### Attributes

- `model-value / v-model`
- `max`
- `size`
- `disabled`
- `allow-half`
- `low-threshold`
- `high-threshold`
- `colors`
- `void-color`
- `disabled-void-color`
- `icons`
- `void-icon`
- `disabled-void-icon`
- `show-text`
- `show-score`
- `text-color`
- `texts`
- `score-template`
- `clearable ^`
- `id`
- `aria-label ^ ^`
- `label ^ ^`

#### Events

- `change`

#### Exposes

- `setCurrentValue`
- `resetCurrentValue`

## 2026-07-13 delivered

- [x] Add thresholds, color/icon arrays, void/disabled icons, `id`, `aria-label`, `label`, and `validate-event`.
- [x] Route score changes through FormItem validation; expose `setCurrentValue` and `resetCurrentValue`.
- [x] Add threshold-color/icon rendering tests and a playground example.

## 当前 ElfUI API 快照

### Props

- `allowHalf`
- `character`
- `clearable`
- `color`
- `disabled`
- `disabledColor`
- `max`
- `modelValue`
- `readonly`
- `scoreTemplate`
- `showScore`
- `showText`
- `size`
- `texts`
- `voidCharacter`
- `voidColor`

### Events

- `change`
- `clear`
- `hover-change`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`low-threshold`、`high-threshold`、`colors`、`disabled-void-color`、`icons`、`void-icon`、`disabled-void-icon`、`text-color`、`id`、`aria-label ^ ^`、`label ^ ^`
- [ ] P0 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
- [ ] P1 补齐插槽/暴露方法：`setCurrentValue`、`resetCurrentValue`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
