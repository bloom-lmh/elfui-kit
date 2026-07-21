# ColorPicker Element Plus API 对标计划

## 2026-07-19 案例回归
- [x] 解除标题状态槽裁切，完整显示 rgba 右括号

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/ColorPicker`
- Element Plus 文档：`color-picker.md`、`color-picker-panel.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### color-picker.md

#### API

- `model-value / v-model`
- `disabled`
- `clearable ^`
- `size`
- `show-alpha`
- `color-format`
- `popper-class`
- `popper-style ^`
- `predefine`
- `validate-event`
- `tabindex`
- `aria-label ^ ^`
- `empty-values ^`
- `value-on-clear ^`
- `id`
- `teleported ^`
- `label ^ ^`
- `persistent ^`
- `append-to ^`
- `change`
- `active-change`
- `focus ^`
- `blur ^`
- `clear ^`
- `color`
- `show ^`
- `hide ^`

#### Attributes

- `model-value / v-model`
- `disabled`
- `clearable ^`
- `size`
- `show-alpha`
- `color-format`
- `popper-class`
- `popper-style ^`
- `predefine`
- `validate-event`
- `tabindex`
- `aria-label ^ ^`
- `empty-values ^`
- `value-on-clear ^`
- `id`
- `teleported ^`
- `label ^ ^`
- `persistent ^`
- `append-to ^`

#### Events

- `change`
- `active-change`
- `focus ^`
- `blur ^`
- `clear ^`

#### Exposes

- `color`
- `show ^`
- `hide ^`
- `focus ^`
- `blur ^`

### color-picker-panel.md

#### API

- `model-value / v-model`
- `border`
- `disabled`
- `show-alpha`
- `color-format`
- `predefine`
- `validate-event ^`
- `hue-slider-class ^`
- `hue-slider-style ^`
- `footer`
- `color`
- `inputRef`
- `update ^`

#### Attributes

- `model-value / v-model`
- `border`
- `disabled`
- `show-alpha`
- `color-format`
- `predefine`
- `validate-event ^`
- `hue-slider-class ^`
- `hue-slider-style ^`

#### Slots

- `footer`

#### Exposes

- `color`
- `inputRef`
- `update ^`

## 当前 ElfUI API 快照

### Props

- `clearable`
- `disabled`
- `format`
- `modelValue`
- `presets`
- `showAlpha`

### Events

- `change`
- `clear`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`size`、`color-format`、`popper-class`、`popper-style ^`、`predefine`、`validate-event`、`tabindex`、`aria-label ^ ^`、`empty-values ^`、`value-on-clear ^`、`id`、`teleported ^`、`label ^ ^`、`persistent ^`、`append-to ^`、`border`、`validate-event ^`、`hue-slider-class ^`、`hue-slider-style ^`
- [ ] P0 补齐事件差距：`active-change`、`focus ^`、`blur ^`
- [ ] P1 补齐插槽/暴露方法：`footer`、`color`、`show ^`、`hide ^`、`focus ^`、`blur ^`、`inputRef`、`update ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-16 Field Surface 与预设色修复

- [x] 接入共享 `filled / outlined`、浮动标签及禁用/暗色状态，修复预设色 style 绑定与事件代理并补定向测试。

## 2026-07-19 RGBA 状态回归

- [x] 扩大颜色值展示宽度并使用等宽数字，确保完整 `rgba(...)` 文本不裁掉右括号。
- [x] 清空操作使用语义化 SVG 图标和可访问名称，不再使用普通字符叉号。
