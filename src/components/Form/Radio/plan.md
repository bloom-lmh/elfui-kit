# Radio Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Radio`
- Element Plus 文档：`radio.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### radio.md

#### Radio API

- `model-value / v-model`
- `value ^`
- `label`
- `disabled`
- `border`
- `size`
- `change`
- `default`

#### Radio Attributes

- `model-value / v-model`
- `value ^`
- `label`
- `disabled`
- `border`
- `size`

#### Radio Events

- `change`

#### Radio Slots

- `default`

#### RadioGroup API

- `model-value / v-model`
- `size`
- `disabled`
- `validate-event`
- `text-color`
- `fill`
- `aria-label ^ ^`
- `id`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`
- `change`
- `default`

#### RadioGroup Attributes

- `model-value / v-model`
- `size`
- `disabled`
- `validate-event`
- `text-color`
- `fill`
- `aria-label ^ ^`
- `id`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`

#### RadioGroup Events

- `change`

#### RadioGroup Slots

- `default`

#### RadioButton API

- `value ^`
- `label`
- `disabled`
- `default`

#### RadioButton Attributes

- `value ^`
- `label`
- `disabled`

#### RadioButton Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `border`
- `disabled`
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

- [ ] P0 补齐核心属性差距：`validate-event`、`text-color`、`fill`、`aria-label ^ ^`、`id`、`options ^`、`props ^`、`type ^`
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

## 2026-07-13 delivered

- [x] Add `id`, `name`, `aria-label`, and roving `tabindex` to the existing slot-based Radio API.
- [x] Add Arrow-key navigation events for RadioGroup and focused component tests.
- [x] Update API reference and keyboard guidance.

## Remaining

- [ ] Declarative `options`/`props` rendering and RadioButton remain a separate follow-up; they are not represented as implemented in this batch.

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Radio 单选组件开发与重构计划

## 1. 目标定位

提供高内聚、易伸缩的单选框组件。支持单个使用、RadioGroup 组配合使用、禁用态、带边框样式等多种灵活表单场景。

## 2. 计划与重构任务

- [x] **2.1 底座依赖注入打通**: 升级底层 `Symbol.for` 框架机制，使 `Radio` 与 `RadioGroup` 在复杂 monorepo 和多模块加载中能够 100% 互联，解决案例点击全部失效的宿疾。
- [x] **2.2 表单集成与禁用控制**: 统一支持 `useDisabled` 高级 Composable 状态控制。
- [x] **2.3 双保险事件绝对封锁**:
  - [x] 在 `select(e)` 事件处理器最前端进行 `e.stopPropagation()` 与 `e.preventDefault()` 截断。
  - [x] 逻辑层通过 `useEventListener(useHost(), 'click')` 对宿主级点击做安全保护。
  - [x] 模板内对子元素 `.dot` 和 `.label` 明确赋予 `@click.stop.prevent="select"` 绑定，杜绝冒泡到 SPA 路由系统。
- [x] **2.4 自定义展示页与测试**: 确保 `page-radio` 的案例展现流畅、高质。
