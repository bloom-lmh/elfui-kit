# Table Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Table`
- Element Plus 文档：`table.md`、`table-v2.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### table.md

#### Table API

- `data`
- `height`
- `max-height`
- `stripe`
- `border`
- `size`
- `fit`
- `show-header`
- `highlight-current-row`
- `current-row-key`
- `row-class-name`
- `row-style`
- `cell-class-name`
- `cell-style`
- `header-row-class-name`
- `header-row-style`
- `header-cell-class-name`
- `header-cell-style`
- `row-key`
- `empty-text`
- `default-expand-all`
- `expand-row-keys`
- `default-sort`
- `tooltip-effect`
- `tooltip-options ^`
- `append-filter-panel-to ^`
- `show-summary`
- `sum-text`
- `summary-method`
- `span-method`
- `select-on-indeterminate`
- `indent`
- `lazy`
- `load`
- ...另有 49 项，详见来源文档

#### Table Attributes

- `data`
- `height`
- `max-height`
- `stripe`
- `border`
- `size`
- `fit`
- `show-header`
- `highlight-current-row`
- `current-row-key`
- `row-class-name`
- `row-style`
- `cell-class-name`
- `cell-style`
- `header-row-class-name`
- `header-row-style`
- `header-cell-class-name`
- `header-cell-style`
- `row-key`
- `empty-text`
- `default-expand-all`
- `expand-row-keys`
- `default-sort`
- `tooltip-effect`
- `tooltip-options ^`
- `append-filter-panel-to ^`
- `show-summary`
- `sum-text`
- `summary-method`
- `span-method`
- `select-on-indeterminate`
- `indent`
- `lazy`
- `load`
- ...另有 11 项，详见来源文档

#### Table Events

- `select`
- `select-all`
- `selection-change`
- `cell-mouse-enter`
- `cell-mouse-leave`
- `cell-click`
- `cell-dblclick`
- `cell-contextmenu`
- `row-click`
- `row-contextmenu`
- `row-dblclick`
- `header-click`
- `header-contextmenu`
- `sort-change`
- `filter-change`
- `current-change`
- `header-dragend`
- `expand-change`
- `scroll ^`

#### Table Slots

- `default`
- `append`
- `empty`

#### Table Exposes

- `clearSelection`
- `getSelectionRows`
- `getHalfSelectionRows ^`
- `toggleRowSelection`
- `toggleAllSelection`
- `toggleRowExpansion`
- `setCurrentRow`
- `clearSort`
- `clearFilter`
- `doLayout`
- `sort`
- `scrollTo`
- `setScrollTop`
- `setScrollLeft`
- `columns ^`
- `updateKeyChildren ^`

#### Table-column API

- `type`
- `index`
- `label`
- `column-key`
- `width`
- `min-width`
- `fixed`
- `render-header`
- `sortable`
- `sort-method`
- `sort-by`
- `sort-orders`
- `resizable`
- `formatter`
- `show-overflow-tooltip`
- `align`
- `header-align`
- `class-name`
- `label-class-name`
- `selectable`
- `reserve-selection`
- `filters`
- `filter-placement`
- `filter-class-name ^`
- `filter-multiple`
- `filter-method`
- `filtered-value`
- `tooltip-formatter ^`
- `default`
- `header`
- `filter-icon ^`
- `expand ^`

#### Table-column Attributes

- `type`
- `index`
- `label`
- `column-key`
- `width`
- `min-width`
- `fixed`
- `render-header`
- `sortable`
- `sort-method`
- `sort-by`
- `sort-orders`
- `resizable`
- `formatter`
- `show-overflow-tooltip`
- `align`
- `header-align`
- `class-name`
- `label-class-name`
- `selectable`
- `reserve-selection`
- `filters`
- `filter-placement`
- `filter-class-name ^`
- `filter-multiple`
- `filter-method`
- `filtered-value`
- `tooltip-formatter ^`

#### Table-column Slots

- `default`
- `header`
- `filter-icon ^`
- `expand ^`

### table-v2.md

#### TableV2 API

- `cache`
- `estimated-row-height`
- `header-class`
- `header-props`
- `header-cell-props`
- `header-height`
- `footer-height`
- `row-class`
- `row-key`
- `row-props`
- `row-height`
- `row-event-handlers`
- `cell-props`
- `columns`
- `data`
- `data-getter`
- `fixed-data`
- `expand-column-key`
- `expanded-row-keys`
- `default-expanded-row-keys`
- `class`
- `fixed`
- `width ^`
- `height ^`
- `max-height`
- `indent-size`
- `h-scrollbar-size`
- `v-scrollbar-size`
- `scrollbar-always-on`
- `sort-by`
- `sort-state`
- `cell`
- `header`
- `header-cell`
- ...另有 28 项，详见来源文档

#### TableV2 Attributes

- `cache`
- `estimated-row-height`
- `header-class`
- `header-props`
- `header-cell-props`
- `header-height`
- `footer-height`
- `row-class`
- `row-key`
- `row-props`
- `row-height`
- `row-event-handlers`
- `cell-props`
- `columns`
- `data`
- `data-getter`
- `fixed-data`
- `expand-column-key`
- `expanded-row-keys`
- `default-expanded-row-keys`
- `class`
- `fixed`
- `width ^`
- `height ^`
- `max-height`
- `indent-size`
- `h-scrollbar-size`
- `v-scrollbar-size`
- `scrollbar-always-on`
- `sort-by`
- `sort-state`

#### TableV2 Slots

- `cell`
- `header`
- `header-cell`
- `row`
- `footer`
- `empty`
- `overlay`

#### TableV2 Events

- `column-sort`
- `expanded-rows-change`
- `end-reached`
- `scroll`
- `rows-rendered`
- `row-expand`

#### TableV2 Exposes

- `scrollTo`
- `scrollToLeft`
- `scrollToTop`
- `scrollToRow`

## 当前 ElfUI API 快照

### Props

- `border`
- `columns`
- `currentRowKey`
- `data`
- `defaultExpandedRowKeys`
- `defaultSelectedKeys`
- `emptyText`
- `expandFormatter`
- `expandedRowKeys`
- `height`
- `highlightCurrentRow`
- `hover`
- `loading`
- `maxHeight`
- `rowKey`
- `selectedKeys`
- `showHeader`
- `size`
- `sortOrder`
- `sortProp`
- `stickyHeader`
- `stripe`

### Events

- `action-click`
- `current-change`
- `expand-change`
- `row-click`
- `selection-change`
- `sort-change`
- `update:expandedRowKeys`
- `update:selectedKeys`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`fit`、`row-class-name`、`row-style`、`cell-class-name`、`cell-style`、`header-row-class-name`、`header-row-style`、`header-cell-class-name`、`header-cell-style`、`default-expand-all`、`expand-row-keys`、`default-sort`、`tooltip-effect`、`tooltip-options ^`、`append-filter-panel-to ^`、`show-summary`、`sum-text`、`summary-method`、`span-method`、`select-on-indeterminate`、`indent`、`lazy`、`load`、`tree-props`、`table-layout`、`scrollbar-always-on`、`show-overflow-tooltip`、`flexible ^` 等 81 项
- [ ] P1 补齐事件差距：`select`、`select-all`、`cell-mouse-enter`、`cell-mouse-leave`、`cell-click`、`cell-dblclick`、`cell-contextmenu`、`row-contextmenu`、`row-dblclick`、`header-click`、`header-contextmenu`、`filter-change`、`header-dragend`、`scroll ^`、`column-sort`、`expanded-rows-change`、`end-reached`、`scroll`、`rows-rendered`、`row-expand`
- [ ] P1 补齐插槽/暴露方法：`append`、`empty`、`header`、`filter-icon ^`、`expand ^`、`cell`、`header-cell`、`row`、`footer`、`overlay`、`clearSelection`、`getSelectionRows`、`getHalfSelectionRows ^`、`toggleRowSelection`、`toggleAllSelection`、`toggleRowExpansion`、`setCurrentRow`、`clearSort`、`clearFilter`、`doLayout`、`sort`、`scrollTo`、`setScrollTop`、`setScrollLeft` 等 29 项
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
