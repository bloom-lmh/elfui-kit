# Cascader Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Cascader`
- Element Plus 文档：`cascader.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### cascader.md

#### Cascader API

- `model-value / v-model`
- `options`
- `props`
- `size`
- `placeholder`
- `disabled`
- `clearable`
- `clear-icon ^`
- `show-all-levels`
- `collapse-tags`
- `collapse-tags-tooltip`
- `max-collapse-tags-tooltip-height ^`
- `separator`
- `filterable`
- `filter-method`
- `debounce`
- `before-filter`
- `popper-class`
- `popper-style`
- `teleported`
- `effect ^`
- `tag-type`
- `tag-effect ^`
- `validate-event`
- `max-collapse-tags ^`
- `empty-values ^`
- `value-on-clear ^`
- `persistent ^`
- `fallback-placements ^`
- `placement ^`
- `popper-append-to-body ^`
- `show-checked-strategy ^`
- `virtual-scroll ^`
- `fit-input-width ^`
- ...另有 23 项，详见来源文档

#### Cascader Attributes

- `model-value / v-model`
- `options`
- `props`
- `size`
- `placeholder`
- `disabled`
- `clearable`
- `clear-icon ^`
- `show-all-levels`
- `collapse-tags`
- `collapse-tags-tooltip`
- `max-collapse-tags-tooltip-height ^`
- `separator`
- `filterable`
- `filter-method`
- `debounce`
- `before-filter`
- `popper-class`
- `popper-style`
- `teleported`
- `effect ^`
- `tag-type`
- `tag-effect ^`
- `validate-event`
- `max-collapse-tags ^`
- `empty-values ^`
- `value-on-clear ^`
- `persistent ^`
- `fallback-placements ^`
- `placement ^`
- `popper-append-to-body ^`
- `show-checked-strategy ^`
- `virtual-scroll ^`
- `fit-input-width ^`
- ...另有 2 项，详见来源文档

#### Cascader Events

- `change`
- `expand-change`
- `blur`
- `focus`
- `clear ^`
- `visible-change`
- `remove-tag`

#### Cascader Slots

- `default`
- `empty`
- `prefix ^`
- `suggestion-item ^`
- `tag ^`
- `header ^`
- `footer ^`

#### Cascader Exposes

- `getCheckedNodes`
- `cascaderPanelRef`
- `togglePopperVisible ^`
- `contentRef`
- `presentText ^`
- `focus ^`
- `blur ^`

#### CascaderPanel API

- `model-value / v-model`
- `options`
- `props`
- `virtual-scroll ^`
- `item-size ^`
- `height ^`
- `change`
- `update:modelValue`
- `expand-change`
- `close`
- `default`
- `empty ^`
- `getCheckedNodes`
- `clearCheckedNodes`

#### CascaderPanel Attributes

- `model-value / v-model`
- `options`
- `props`
- `virtual-scroll ^`
- `item-size ^`
- `height ^`

#### CascaderPanel Events

- `change`
- `update:modelValue`
- `expand-change`
- `close`

#### CascaderPanel Slots

- `default`
- `empty ^`

#### CascaderPanel Exposes

- `getCheckedNodes`
- `clearCheckedNodes`

#### CascaderProps

- `expandTrigger`
- `multiple`
- `checkStrictly`
- `emitPath`
- `lazy`
- `lazyLoad`
- `value`
- `label`
- `children`
- `disabled`
- `leaf`
- `hoverThreshold`
- `checkOnClickNode ^`
- `checkOnClickLeaf ^`
- `showPrefix ^`

## 当前 ElfUI API 快照

### Props

- `checkable`
- `checkOnClickLeaf`
- `checkOnClickNode`
- `clearable`
- `collapseTags`
- `collapseTagsTooltip`
- `disabled`
- `emitPath`
- `expandTrigger`
- `height`
- `itemSize`
- `maxCollapseTags`
- `maxCollapseTagsTooltipHeight`
- `modelValue`
- `multiple`
- `options`
- `placeholder`
- `props`
- `separator`
- `showAllLevels`
- `showCheckedStrategy`
- `showPrefix`
- `size`
- `virtualScroll`

### Events

- `blur`
- `change`
- `clear`
- `expand-change`
- `focus`
- `update:modelValue`
- `visible-change`

### Slots

- 暂无记录

### Exposes

- `clear`
- `close`
- `getCheckedNodes`
- `open`
- `presentText`
- `togglePopperVisible`

### CascaderPanel

- 新增 `elf-cascader-panel`
- Props：`modelValue`、`options`、`props`、`multiple`、`checkable`、`checkStrictly`、`emitPath`、`showPrefix`、`virtualScroll`、`itemSize`、`height`
- Events：`update:modelValue`、`change`、`expand-change`、`close`
- Exposes：`getCheckedNodes`、`clearCheckedNodes`

## 本轮已完成（2026-07-05）

- [x] P0 Add debounced `filterable` searching with selectable path results, custom `filter-method`, async `before-filter` cancellation, an empty slot fallback, tests, and a Playground example.

- [x] 兼容 Element Plus `props.multiple`、`props.checkStrictly`、`props.emitPath`、`props.expandTrigger`、`props.showPrefix`、`props.checkOnClickNode`、`props.checkOnClickLeaf`。
- [x] 补齐 `show-all-levels`、`collapse-tags`、`max-collapse-tags`、`show-checked-strategy` 的基础展示逻辑。
- [x] 补齐 `expand-change`、`focus`、`blur` 事件和 `getCheckedNodes`、`togglePopperVisible`、`presentText` 暴露方法。
- [x] 新增 `elf-cascader-panel` 独立面板，支持单选、多选、复选框前缀、`height/item-size`、`getCheckedNodes`、`clearCheckedNodes`。
- [x] 补充 Cascader / CascaderPanel 单测并接入 Form 注册和类型出口。

## 差距与任务

- [ ] P0 补齐核心属性差距：`clear-icon ^`、`collapse-tags-tooltip`、`max-collapse-tags-tooltip-height ^`、`filterable`、`filter-method`、`debounce`、`before-filter`、`popper-class`、`popper-style`、`teleported`、`effect ^`、`tag-type`、`tag-effect ^`、`validate-event`、`empty-values ^`、`value-on-clear ^`、`persistent ^`、`fallback-placements ^`、`placement ^`、`popper-append-to-body ^`、`virtual-scroll ^`、`fit-input-width ^` 等未完成项。
- [ ] P0 补齐事件差距：`remove-tag`，并继续核对 `change` payload 是否需要再贴近 Element Plus 原始值。
- [ ] P1 补齐插槽/暴露方法：`empty`、`prefix ^`、`suggestion-item ^`、`tag ^`、`header ^`、`footer ^`、`cascaderPanelRef`、`contentRef`、`focus ^`、`blur ^`。
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
