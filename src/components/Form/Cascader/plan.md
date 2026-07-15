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

- [x] P0 完成 `teleported` Top Layer、`append-to`、`persistent`、`placement`、`fit-input-width`、`popper-class/style/options`，支持 offset、flip、碰撞约束、视觉视口与捕获滚动重定位。
- [x] P0 完成可移除多选标签、`collapse-tags-tooltip` 和 `remove-tag` 原始模型值事件。
- [x] P1 完成 `empty`、`prefix`、`suggestion-item`、`tag`、`header`、`footer` 与节点默认插槽。
- [x] P1 完成触发器/菜单方向键、Home、End、Escape 键盘访问，并接入 change/blur 表单校验触发。
- [x] P2 新增裁切容器内的多选标签、插槽和 teleported Playground 案例与边界测试。
- [ ] P0 补齐 `clear-icon`、`effect`、`tag-type/effect`、`empty-values`、`value-on-clear` 和 fallback placement API 细节。
- [ ] P1 完成 lazy/lazyLoad 真实异步加载状态与失败恢复，而不只保留配置类型。
- [ ] P1 补齐 `cascaderPanelRef`、`contentRef`、无冲突的 focus/blur 暴露，并为 CascaderPanel 补默认/empty 插槽。
- [ ] P2 完成全部公开类型/PropsTable 终审、页面冒烟和视觉回归。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `npm run build` 通过；涉及运行时能力时补跑目标测试。
