# Checkbox Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Checkbox`
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
- `indeterminate`
- `label`
- `modelValue`
- `size`
- `value`

### Events

- `change`
- `update:modelValue`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`true-value ^`、`false-value ^`、`border`、`checked`、`validate-event`、`tabindex`、`id`、`aria-controls ^ ^`、`aria-label ^`、`true-label ^`、`false-label ^`、`controls ^ ^`、`min`、`max`、`aria-label ^ ^`、`text-color`、`fill`、`tag`、`options ^`、`props ^`、`type ^`
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

# Checkbox 复选框组件开发与重构计划

## 1. 目标定位

提供灵活耐用、符合 Material Design 规范的复选框组件。支持单个使用（布尔模式）、组合使用（CheckboxGroup 模式）、禁用态及半选态（indeterminate）。

## 2. 计划与重构任务

- [x] **2.1 依赖注入连接**: 升级底层 `Symbol.for`，使 `Checkbox` 与 `CheckboxGroup` 在多实例打包环境下能够 100% 互联成功，完美取得 `group` 响应式数据和更改函数。
- [x] **2.2 表单禁用与尺寸传递**: 支持 `useDisabled` 继承自身或上层组的禁用状态。
- [x] **2.3 双保险防事件逃逸机制**:
  - [x] 在逻辑层 `toggle` 处理器中在有事件传入时，立即执行 `e.preventDefault()` 和 `e.stopPropagation()`。
  - [x] 在 `useHost()` 宿主级使用 `useEventListener` 绑定 click 事件代理。
  - [x] 在模板子节点 `.box` 与 `.label` 上显式附加 `@click.stop.prevent="toggle"`，从 Shadow DOM 内部最底层彻底切断点击事件的捕获和向外冒泡，解决单选点击导致其它 Showcase 示例被强制重置/页面刷新的 Bug。
- [x] **2.4 自定义展示页与测试**: 确保 `page-checkbox` 的案例能够正确展示。
