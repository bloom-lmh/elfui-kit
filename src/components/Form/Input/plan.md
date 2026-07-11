# Input Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Input`
- Element Plus 文档：`input.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### input.md

#### API

- `type`
- `model-value / v-model`
- `model-modifiers ^`
- `maxlength`
- `minlength`
- `show-word-limit`
- `word-limit-position ^`
- `placeholder`
- `clearable`
- `clear-icon ^`
- `formatter`
- `parser`
- `show-password`
- `disabled`
- `size`
- `prefix-icon`
- `suffix-icon`
- `rows`
- `autosize`
- `autocomplete`
- `readonly`
- `max`
- `min`
- `step`
- `resize`
- `autofocus`
- `form`
- `aria-label ^ ^`
- `tabindex`
- `validate-event`
- `input-style`
- `label ^ ^`
- `inputmode ^`
- `count-graphemes ^`
- ...另有 23 项，详见来源文档

#### Attributes

- `type`
- `model-value / v-model`
- `model-modifiers ^`
- `maxlength`
- `minlength`
- `show-word-limit`
- `word-limit-position ^`
- `placeholder`
- `clearable`
- `clear-icon ^`
- `formatter`
- `parser`
- `show-password`
- `disabled`
- `size`
- `prefix-icon`
- `suffix-icon`
- `rows`
- `autosize`
- `autocomplete`
- `readonly`
- `max`
- `min`
- `step`
- `resize`
- `autofocus`
- `form`
- `aria-label ^ ^`
- `tabindex`
- `validate-event`
- `input-style`
- `label ^ ^`
- `inputmode ^`
- `count-graphemes ^`

#### Events

- `blur`
- `focus`
- `change`
- `input`
- `clear`
- `keydown`
- `mouseleave`
- `mouseenter`
- `compositionstart`
- `compositionupdate`
- `compositionend`

#### Slots

- `prefix`
- `suffix`
- `prepend`
- `append`
- `password-icon ^`

#### Exposes

- `blur`
- `clear`
- `focus`
- `input`
- `ref`
- `resizeTextarea`
- `select`
- `textarea`
- `textareaStyle`
- `isComposing ^`
- `passwordVisible ^`

## 当前 ElfUI API 快照

### Props

- `clearable`
- `disabled`
- `maxlength`
- `modelValue`
- `placeholder`
- `prefixIcon`
- `readonly`
- `size`
- `suffixIcon`
- `type`

### Events

- `blur`
- `change`
- `clear`
- `focus`
- `input`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] 2026-07-06 第一批深度对齐：补 `model-modifiers`、`formatter/parser`、`show-word-limit/word-limit-position/count-graphemes`、`clear-icon`、原生输入属性透传、hover/keydown/composition 事件、`prefix/suffix/prepend/append/password-icon` slots、`focus/blur/select/clear/input/ref/isComposing/passwordVisible` 暴露，并迁移组件模板为 `${...}`。
- [ ] P0 补齐核心属性差距：`model-modifiers ^`、`minlength`、`show-word-limit`、`word-limit-position ^`、`clear-icon ^`、`formatter`、`parser`、`show-password`、`rows`、`autosize`、`autocomplete`、`max`、`min`、`step`、`resize`、`autofocus`、`form`、`aria-label ^ ^`、`tabindex`、`validate-event`、`input-style`、`label ^ ^`、`inputmode ^`、`count-graphemes ^`
- [ ] P0 补齐事件差距：`keydown`、`mouseleave`、`mouseenter`、`compositionstart`、`compositionupdate`、`compositionend`
- [ ] P1 补齐插槽/暴露方法：`prefix`、`suffix`、`prepend`、`append`、`password-icon ^`、`blur`、`clear`、`focus`、`input`、`ref`、`resizeTextarea`、`select`、`textarea`、`textareaStyle`、`isComposing ^`、`passwordVisible ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 后续待细化

- `rows`、`autosize`、`resize`、`textarea/textareaStyle/resizeTextarea` 与现有独立 `Textarea` 组件存在职责重叠，后续需要决定是让 `elf-input type="textarea"` 代理到 Textarea，还是在文档中明确拆分边界。
- `validate-event` 当前按 setup 初始值接入表单触发开关，后续若需要运行时动态切换需升级 `useFormControl` 触发器读取方式。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Input 单行输入框组件开发与重构计划

## 1. 目标定位

对标 Element Plus Input，提供通用单行文本/密码输入框 `<elf-input>`。高度适配全局/表单项的禁用与尺寸传递，原生表单事件的高效劫持与转发，内置密码可见性切换、一键清除、格式化等丰富的高阶能力。

## 2. 计划与重构任务

- [x] **2.1 表单联动组合器继承**:
  - [x] `useFormControl`: 组合双向数据绑定与 FormItem 触发校验逻辑。
  - [x] `useFormItem`: 连接并从 Form/FormItem 读取大小与校验状态。
  - [x] `useDisabled`: 支持级联式禁用判定。
- [x] **2.2 视觉与状态同步**:
  - [x] 使用 `useHostAttr` 反射 `data-state` 校验状态，以便根据外层 FormItem 的成功/失败/验证中状态自适应变换边框或高亮底色。
  - [x] 使用 `useTemplateRef` 建立对 `<input>` DOM 的引用。
- [x] **2.3 辅助器功能集成**:
  - [x] `showClear`: 一键清除功能，当非禁用且存在字符时显示 `×` 清空键，并触发 `@clear` 事件。
  - [x] `showPassword`: 支持密码模式，通过内置 `pwdVisible` 逻辑实现密文 `👁` 和明文 `🙈` 转换。
- [x] **2.4 自定义 Part CSS Scoping**: 采用 shadow root `part="wrapper"` 等定义，允许用户在全局或组件外部进行微调样式。
