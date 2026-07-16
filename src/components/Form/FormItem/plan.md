# FormItem Element Plus API 对标计划

## 本轮记录

- [x] 2026-07-16 为输入型表单控件建立统一的满宽布局契约，保证 Card、双列与动态字段场景对齐。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/FormItem`
- Element Plus 文档：`form.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### form.md

#### Form API

- `model`
- `rules`
- `inline`
- `label-position`
- `label-width`
- `label-suffix`
- `hide-required-asterisk`
- `require-asterisk-position`
- `show-message`
- `inline-message`
- `status-icon`
- `validate-on-rule-change`
- `size`
- `disabled`
- `scroll-to-error`
- `scroll-into-view-options ^`
- `validate`
- `default`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields ^`
- `getField ^`
- `setInitialValues ^`

#### Form Attributes

- `model`
- `rules`
- `inline`
- `label-position`
- `label-width`
- `label-suffix`
- `hide-required-asterisk`
- `require-asterisk-position`
- `show-message`
- `inline-message`
- `status-icon`
- `validate-on-rule-change`
- `size`
- `disabled`
- `scroll-to-error`
- `scroll-into-view-options ^`

#### Form Events

- `validate`

#### Form Slots

- `default`

#### Form Exposes

- `validate`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields ^`
- `getField ^`
- `setInitialValues ^`

#### FormItem API

- `label`
- `label-position ^`
- `label-width`
- `required`
- `rules`
- `error`
- `show-message`
- `inline-message`
- `size`
- `for`
- `validate-status`
- `trigger`
- `default`
- `validateMessage`
- `validateState`
- `validate`
- `resetField`
- `clearValidate`
- `setInitialValue ^`

#### FormItem Attributes

- `label`
- `label-position ^`
- `label-width`
- `required`
- `rules`
- `error`
- `show-message`
- `inline-message`
- `size`
- `for`
- `validate-status`
- `trigger`

#### FormItem Slots

- `default`
- `label`
- `error`

#### FormItem Exposes

- `size`
- `validateMessage`
- `validateState`
- `validate`
- `resetField`
- `clearValidate`
- `setInitialValue ^`

## 当前 ElfUI API 快照

### Props

- `error`
- `inlineMessage`
- `label`
- `prop`
- `required`
- `rules`
- `showMessage`
- `size`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`model`、`inline`、`label-position`、`label-width`、`label-suffix`、`hide-required-asterisk`、`require-asterisk-position`、`status-icon`、`validate-on-rule-change`、`disabled`、`scroll-to-error`、`scroll-into-view-options ^`、`label-position ^`、`for`、`validate-status`、`trigger`
- [ ] P0 补齐事件差距：`validate`
- [ ] P1 补齐插槽/暴露方法：`label`、`error`、`validate`、`validateField`、`resetFields`、`scrollToField`、`clearValidate`、`fields ^`、`getField ^`、`setInitialValues ^`、`size`、`validateMessage`、`validateState`、`resetField`、`setInitialValue ^`
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

# FormItem 表单项组件开发与重构计划

## 1. 目标定位

对标 Element Plus，提供表单项目包装容器 `<elf-form-item>`。负责提供标签 Label、必填星号展示、包裹底层具体控件、收集并应用字段级校验规则、并在校验失败或成功时展示校验状态与提示信息。

## 2. 计划与重构任务

- [x] **2.1 状态注入与收集**:
  - [x] 向上通过 `inject(FORM_KEY)` 连接 `<elf-form>` 容器，并在挂载时执行 `form.registerItem` 登记自身实例。
  - [x] 向下通过 `provide(FORM_ITEM_KEY)` 向内部的具体输入型控件（如 `Input`, `Select`, `Checkbox` 等）提供字段上下文，用于触发联动校验。
- [x] **2.2 嵌套字段支持**: 支持使用路径字符串（如 `prop="user.name"`）访问和操作 `form.model` 中深层嵌套的数据结构。
- [x] **2.3 多触发时机校验 (Trigger)**: 支持配置 `blur`, `change`, `input` 等触发类型，根据用户交互动态调度异步校验器。
- [x] **2.4 自定义重置 (Reset) 机制**: 在 `onMount` 时期缓存字段的初始值 `initialValue`，当触发 `resetField` 时精确还原数据并清理校验状态。
