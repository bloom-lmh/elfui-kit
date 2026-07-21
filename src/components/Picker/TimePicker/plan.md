# TimePicker Element Plus API 对标计划

## 2026-07-21 分钟激活态

- [x] 分钟点击后同步更新钟面 active 与 `aria-pressed`，声明式刷新后再次校准。

## 2026-07-19 interaction and field fixes

- [x] Keep the floating label above an empty placeholder so the clock icon, label, and placeholder never overlap.
- [x] Give hour and minute dial nodes unit-specific keys to prevent stale labels, positions, and active states after switching units.
- [x] Cover dial switching, active state, range clearing, shortcuts, and shared field surfaces with focused tests.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/TimePicker`
- Element Plus 文档：`time-picker.md`、`time-select.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### time-picker.md

#### API

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `is-range`
- `arrow-control`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `format`
- `default-value`
- `value-format`
- `id`
- `aria-label ^ ^`
- `prefix-icon`
- `clear-icon`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `teleported`
- `tabindex`
- `empty-values ^`
- `value-on-clear ^`
- `save-on-blur ^`
- `label ^ ^`
- `change`
- ...另有 6 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `is-range`
- `arrow-control`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `format`
- `default-value`
- `value-format`
- `id`
- `aria-label ^ ^`
- `prefix-icon`
- `clear-icon`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `teleported`
- `tabindex`
- `empty-values ^`
- `value-on-clear ^`
- `save-on-blur ^`
- `label ^ ^`

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `visible-change`

#### Exposes

- `focus`
- `blur`
- `handleOpen ^`
- `handleClose ^`

### time-select.md

#### API

- `model-value / v-model`
- `disabled`
- `editable`
- `clearable`
- `include-end-time ^`
- `size`
- `placeholder`
- `name ^`
- `effect`
- `prefix-icon`
- `clear-icon`
- `start`
- `end`
- `step`
- `min-time`
- `max-time`
- `format`
- `empty-values ^`
- `value-on-clear ^`
- `popper-class ^`
- `popper-style ^`
- `change`
- `blur`
- `focus`
- `clear ^`

#### Attributes

- `model-value / v-model`
- `disabled`
- `editable`
- `clearable`
- `include-end-time ^`
- `size`
- `placeholder`
- `name ^`
- `effect`
- `prefix-icon`
- `clear-icon`
- `start`
- `end`
- `step`
- `min-time`
- `max-time`
- `format`
- `empty-values ^`
- `value-on-clear ^`
- `popper-class ^`
- `popper-style ^`

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`

#### Exposes

- `focus`
- `blur`

## 当前 ElfUI API 快照

### Props

- `clearable`
- `disabled`
- `editable`
- `endPlaceholder`
- `endValue`
- `emptyValues`
- `id`
- `isRange`
- `max`
- `min`
- `modelValue`
- `name`
- `placeholder`
- `range`
- `rangeSeparator`
- `readonly`
- `saveOnBlur`
- `size`
- `shortcuts`
- `startPlaceholder`
- `step`
- `tabindex`
- `valueOnClear`

### Events

- `blur`
- `change`
- `clear`
- `focus`
- `update:endValue`
- `update:modelValue`
- `visible-change`

### Slots

- 暂无记录

### Exposes

- `blur`
- `focus`
- `handleClose`
- `handleOpen`

## 本轮已完成（2026-07-05）

- [x] 修复原生 `type=time` 的回显绑定，`modelValue="09:30"` 直接写入 input。
- [x] 支持 Element Plus `is-range` 和数组 `modelValue`，同时保留旧 `endValue`。
- [x] 补 `readonly`、`editable`、`size`、`start-placeholder`、`range-separator`、`id/name/tabindex`、`value-on-clear` 基础逻辑。
- [x] 补 `focus`、`blur`、`visible-change` 事件和 `handleOpen`、`handleClose` 暴露方法。
- [x] shortcut 点击从旧字符串事件迁移为 `${...}` 事件代理。

## 差距与任务

- [ ] P0 补齐核心属性差距：`arrow-control`、`popper-class`、`popper-style`、`popper-options`、`fallback-placements ^`、`placement ^`、`format`、`default-value`、`value-format`、`aria-label ^ ^`、`prefix-icon`、`clear-icon`、`disabled-hours`、`disabled-minutes`、`disabled-seconds`、`teleported`、`empty-values ^` 完整配置、`save-on-blur ^` 细节、`label ^ ^` 等未完成项。
- [x] P0 补齐事件差距：`blur`、`focus`、`visible-change`
- [x] P1 补齐插槽/暴露方法：`focus`、`blur`、`handleOpen ^`、`handleClose ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-14 交互升级

- [x] 用“数字表头 + 12 位钟面 + 小时/分钟分步选择 + AM/PM”替代机械原生输入，保留范围、快捷项、键盘微调和清空。
- [x] 完成深浅主题视觉验收；相关测试与 `pnpm build` 通过。

## 2026-07-16 Field Surface 与关闭语义

- [x] 接入共享 `filled / outlined` 和浮动标签；点击外部或外部滚动关闭面板，钟面内部交互不误关闭。
