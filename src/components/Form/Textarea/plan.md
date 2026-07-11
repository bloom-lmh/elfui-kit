# Textarea Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Textarea`
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

- `autosize`
- `disabled`
- `maxlength`
- `modelValue`
- `placeholder`
- `readonly`
- `resize`
- `rows`
- `showCount`
- `size`

### Events

- `blur`
- `change`
- `focus`
- `input`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`type`、`model-modifiers ^`、`minlength`、`show-word-limit`、`word-limit-position ^`、`clearable`、`clear-icon ^`、`formatter`、`parser`、`show-password`、`prefix-icon`、`suffix-icon`、`autocomplete`、`max`、`min`、`step`、`autofocus`、`form`、`aria-label ^ ^`、`tabindex`、`validate-event`、`input-style`、`label ^ ^`、`inputmode ^`、`count-graphemes ^`
- [ ] P0 补齐事件差距：`clear`、`keydown`、`mouseleave`、`mouseenter`、`compositionstart`、`compositionupdate`、`compositionend`
- [ ] P1 补齐插槽/暴露方法：`prefix`、`suffix`、`prepend`、`append`、`password-icon ^`、`blur`、`clear`、`focus`、`input`、`ref`、`resizeTextarea`、`select`、`textarea`、`textareaStyle`、`isComposing ^`、`passwordVisible ^`
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

# Textarea 多行输入框组件开发与重构计划

## 1. 目标定位

对标 Element Plus Input type="textarea"，提供多行文本输入组件 `<elf-textarea>`。支持根据内容自适应高度（autosize）、显示字数统计、限制最大长度、支持拖拽调整大小方向（resize）以及完备的表单禁用与校验状态反射。

## 2. 计划与重构任务

- [x] **2.1 状态关联与基础继承**:
  - [x] 引入 `useFormControl` 进行 v-model 双向绑定及与 FormItem 校验管道连结。
  - [x] 引入 `useFormItem` 获取表单校验状态及尺寸大小。
- [x] **2.2 自适应高度 (autosize) 处理**:
  - [x] 在 input 事件触发时，在微任务队列 `queueMicrotask` 中调用 `adjustHeight`，动态依据当前行高 `lineHeight` 调整高度。
  - [x] 支持传入 `boolean` 或 `{ minRows, maxRows }` 选项指定高度阈值。
- [x] **2.3 字数统计 (showCount)**:
  - [x] 支持在文本框右下角浮动展示当前字数统计，如果配置了 `maxlength` 则以 `当前字数/最大字数` 形式展示。
- [x] **2.4 主流浏览器兼容**:
  - [x] 支持通过 `resize` 属性（如 `none`, `both`, `horizontal`, `vertical`）传入 host data-attribute，在 CSS 中控制多行文本框的拖拽缩放行为。
