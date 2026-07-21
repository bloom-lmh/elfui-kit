# Form Element Plus API 对标计划

## 本轮记录

- [x] 2026-07-16 修复 inline 布局落在错误节点、输入控件宽度不一致和 preventSubmit 类型/运行时不一致；重构居中响应式 Card 案例，并补登录、动态字段、提交校验等独立场景。
- [x] 2026-07-19 修复投影到 Card 内的示例 ref 丢失，重置/清除校验改为稳定宿主查询；行内筛选 Card 允许选择浮层越界显示，并反射 FormItem 校验状态。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Form`
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

- `disabled`
- `hideRequiredAsterisk`
- `inline`
- `labelPosition`
- `labelWidth`
- `model`
- `preventSubmit`
- `rules`
- `scrollToError`
- `size`
- `validateOnRuleChange`

### Events

- `submit`
- `validate`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`label-suffix`、`require-asterisk-position`、`show-message`、`inline-message`、`status-icon`、`scroll-into-view-options ^`、`label`、`required`、`error`、`for`、`validate-status`、`trigger`
- [ ] P0 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
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

# Form 表单容器组件开发与重构计划

## 1. 目标定位

对标 Element Plus，提供表单数据包络容器 `<elf-form>`。集成整表数据源 (`model`) 与统一校验规则配置 (`rules`)，建立父子节点连通管理，提供表单校验、重置、清除校验及滚动到错误项等高阶能力。

## 2. 计划与重构任务

- [x] **2.1 表单数据与规则响应式监听**: 将 `model` 和 `rules` 作为表单的全局核心配置，通过上下文 (`FormContext`) 注入到所有子 FormItem 组件中。
- [x] **2.2 动态子表项注册管理**: 动态收集和管理内部挂载的 `<elf-form-item>` 组件，支持动态增删时自动刷新注册表。
- [x] **2.3 统一校验与定位流程**:
  - [x] `validate`: 并行触发所有已注册子表项的 `validate()` 方法，收集所有异步校验结果，向外 emit `validate` 事件。
  - [x] `scrollToError`: 校验失败时，支持自动平滑滚动到第一个出错的 FormItem 位置。
- [x] **2.4 自定义公共接口暴露**: 使用 `defineExpose` 暴露 `validate`、`validateField`、`resetFields` 和 `clearValidate`，供外部宿主直接调用。
