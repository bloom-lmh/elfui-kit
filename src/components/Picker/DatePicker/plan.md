# DatePicker Element Plus API 对标计划

## 2026-07-16 interaction polish

- [x] Share the circular day selection and fresh range-draft semantics with Calendar.
- [x] Close the anchored panel on outside pointer interaction and external page motion while preserving internal scrolling.

## 2026-07-19 documentation and surface polish

- [x] Remove the redundant appearance gallery and keep the basic shared-field example.
- [x] Keep multiple selections in a fixed-width, horizontally scrollable chip strip so added dates never shift the page layout.
- [x] Flatten the embedded Calendar border/radius inside the confirmation panel and use an SVG remove icon.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/DatePicker`
- Element Plus 文档：`date-picker.md`、`datetime-picker.md`、`date-picker-panel.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### date-picker.md

#### API

- `model-value / v-model`
- `readonly`
- `disabled`
- `size`
- `editable`
- `clearable`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `validate-event`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `teleported`
- `empty-values ^`
- `value-on-clear ^`
- `fallback-placements ^`
- `placement ^`
- `show-footer ^`
- `show-confirm ^`
- ...另有 17 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `readonly`
- `disabled`
- `size`
- `editable`
- `clearable`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `validate-event`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `teleported`
- `empty-values ^`
- `value-on-clear ^`
- `fallback-placements ^`
- `placement ^`
- `show-footer ^`
- `show-confirm ^`
- ...另有 2 项，详见来源文档

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `calendar-change`
- `panel-change`
- `visible-change`

#### Slots

- `default`
- `range-separator`
- `prev-month ^`
- `next-month ^`
- `prev-year ^`
- `next-year ^`

#### Exposes

- `focus`
- `blur ^`
- `handleOpen ^`
- `handleClose ^`

### datetime-picker.md

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
- `arrow-control`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `date-format ^`
- `time-format ^`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `shortcuts`
- `disabled-date`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `cell-class-name`
- ...另有 20 项，详见来源文档

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
- `arrow-control`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `date-format ^`
- `time-format ^`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `shortcuts`
- `disabled-date`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `cell-class-name`
- ...另有 7 项，详见来源文档

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `calendar-change`
- `panel-change`
- `visible-change`

#### Slots

- `default`
- `range-separator`
- `prev-month ^`
- `next-month ^`
- `prev-year ^`
- `next-year ^`

#### Exposes

- `focus`
- `blur ^`

### date-picker-panel.md

#### API

- `model-value / v-model`
- `border`
- `disabled`
- `clearable`
- `editable ^`
- `type`
- `default-value`
- `default-time`
- `value-format`
- `date-format`
- `time-format`
- `unlink-panels`
- `single-panel ^`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `show-footer`
- `show-confirm`
- `show-week-number`
- `calendar-change`
- `panel-change`
- `clear ^`
- `default`
- `prev-month`
- `next-month`
- `prev-year`
- `next-year`

#### Attributes

- `model-value / v-model`
- `border`
- `disabled`
- `clearable`
- `editable ^`
- `type`
- `default-value`
- `default-time`
- `value-format`
- `date-format`
- `time-format`
- `unlink-panels`
- `single-panel ^`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `show-footer`
- `show-confirm`
- `show-week-number`

#### Events

- `calendar-change`
- `panel-change`
- `clear ^`

#### Slots

- `default`
- `prev-month`
- `next-month`
- `prev-year`
- `next-year`

## 当前 ElfUI API 快照

### Props

- `actions`
- `cancelText`
- `clearText`
- `clearable`
- `confirmText`
- `disabled`
- `endPlaceholder`
- `endValue`
- `header`
- `max`
- `min`
- `modelValue`
- `multiple`
- `placeholder`
- `range`
- `shortcuts`
- `showHeader`
- `type`

### Events

- `update:endValue`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P0 补齐核心属性差距：`readonly`、`size`、`editable`、`start-placeholder`、`format`、`popper-class`、`popper-style`、`popper-options`、`range-separator`、`default-value`、`default-time`、`value-format`、`id`、`unlink-panels`、`single-panel ^`、`prefix-icon`、`clear-icon`、`validate-event`、`disabled-date`、`cell-class-name`、`teleported`、`empty-values ^`、`value-on-clear ^`、`fallback-placements ^`、`placement ^`、`show-footer ^`、`show-confirm ^`、`show-week-number ^` 等 43 项
- [ ] P0 补齐事件差距：`change`、`blur`、`focus`、`clear ^`、`calendar-change`、`panel-change`、`visible-change`
- [ ] P1 补齐插槽/暴露方法：`range-separator`、`prev-month ^`、`next-month ^`、`prev-year ^`、`next-year ^`、`prev-month`、`next-month`、`prev-year`、`next-year`、`focus`、`blur ^`、`handleOpen ^`、`handleClose ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-14 交互升级

- [x] 使用 Calendar 作为单日期、范围和多日期面板，月份使用层级网格，保留快捷项与确认/取消草稿语义。
- [x] 新面板完成圆角 surface、暗色主题、受控回显和真实浏览器验收；相关测试与 `pnpm build` 通过。

## 2026-07-16 Field Surface 与关闭语义

- [x] 接入共享 `filled / outlined` 和浮动标签；点击外部或外部滚动关闭面板，面板内部交互保持打开。
