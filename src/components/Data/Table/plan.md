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
- `defaultExpandAll`
- `defaultSort`
- `defaultExpandedRowKeys`
- `defaultSelectedKeys`
- `emptyText`
- `expandFormatter`
- `expandedRowKeys`
- `height`
- `fit`
- `headerCellClassName`
- `headerCellStyle`
- `headerRowClassName`
- `headerRowStyle`
- `highlightCurrentRow`
- `hover`
- `loading`
- `maxHeight`
- `rowClassName`
- `rowKey`
- `rowStyle`
- `cellClassName`
- `cellStyle`
- `scrollbarAlwaysOn`
- `selectOnIndeterminate`
- `selectedKeys`
- `showHeader`
- `showOverflowTooltip`
- `showSummary`
- `size`
- `sortOrder`
- `sortProp`
- `spanMethod`
- `stickyHeader`
- `stripe`
- `sumText`
- `summaryMethod`
- `tableLayout`

### Events

- `action-click`
- `cell-click`
- `cell-contextmenu`
- `cell-dblclick`
- `cell-mouse-enter`
- `cell-mouse-leave`
- `current-change`
- `expand-change`
- `header-click`
- `header-contextmenu`
- `row-click`
- `row-contextmenu`
- `row-dblclick`
- `scroll`
- `select`
- `select-all`
- `selection-change`
- `sort-change`
- `update:expandedRowKeys`
- `update:selectedKeys`

### Slots

- `append`
- `empty`

### Exposes

- `clearSelection`
- `getSelectionRows`
- `toggleRowSelection`
- `toggleAllSelection`
- `toggleRowExpansion`
- `setCurrentRow`
- `clearSort`
- `sort`
- `doLayout`
- `scrollTo`
- `setScrollTop`
- `setScrollLeft`

## 差距与任务

Table 与 TableV2 的渲染模型不同：前者使用原生表格语义，后者依赖虚拟化窗口。两者不在同一组件中混合实现；本计划先闭环经典 Table，TableV2 另立组件计划。

### 阶段 A：经典 Table 高频契约（2026-07-15 完成）

- [x] 样式与布局：`fit`、`table-layout`、`scrollbar-always-on`、行/单元格/表头 class 与 style 回调。
- [x] 初始状态：`default-sort`、`default-expand-all`、受控/非受控选择与展开同步。
- [x] 选择行为：`selectable`、`select-on-indeterminate`、`select`、`select-all` 与禁用态。
- [x] 鼠标事件：cell/row/header 的 click、dblclick、contextmenu，以及 cell mouseenter/mouseleave。
- [x] 数据展示：`show-overflow-tooltip`、列级 tooltip 覆盖、`show-summary`、`sum-text`、`summary-method`。
- [x] 插槽与方法：`empty`、`append`、`toggleAllSelection`、`doLayout`、`scrollTo`、`setScrollTop`、`setScrollLeft`。
- [x] 类型、PropsTable、独立案例、组件单测与页面冒烟同步。

### 阶段 B：经典 Table 进阶数据能力

- [x] `span-method` 合并单元格，并覆盖数组/对象结果与 0 rowspan/colspan 边界。
- [ ] 树形数据：`tree-props`、`indent`、`lazy`、`load`、展开状态与键盘交互。
- [x] 列排序扩展：`sort-method`、`sort-by`、`sort-orders`、`sortable="custom"`，并修正 default/受控排序同步。
- [x] 列过滤：filters、filter-method、filtered-value、filter-change、clearFilter 与过滤面板定位。
- [x] 可调整列宽：`resizable`、header-dragend 与固定列布局重算。
- [ ] 自定义列内容：header/cell/expand/filter-icon 插槽或等价渲染器契约。
- [ ] tooltip-options、tooltip-formatter 与可访问的浮层提示，不只依赖原生 title。
- [ ] 完成阶段 B 的组件测试、页面案例与浏览器视觉回归。

### 阶段 C：独立 TableV2

- [ ] 新建虚拟化 TableV2 组件与计划，覆盖固定行高、动态行高、固定数据、横纵滚动与窗口缓存。
- [ ] 补齐 TableV2 的 cell/header/row/footer/empty/overlay 插槽与滚动公开方法。
- [ ] 补齐 column-sort、expanded-rows-change、end-reached、rows-rendered、row-expand 事件。
- [ ] 使用大数据案例验证渲染窗口、滚动定位、键盘访问与性能边界。

## 验收清单

- [x] 阶段 A 的 API props/types 与页面 PropsTable 同步。
- [x] 阶段 A 的关键交互和边界状态有单测覆盖。
- [x] 阶段 A 文档示例可在 Playground 显示 Template / Script，复制内容使用公开 API。
- [x] 阶段 A 目标测试与构建通过。
- [ ] 阶段 B、C 全部完成后再将根组件计划标记为完成。

## 2026-07-14 体验修复

- [x] 固定列与横向滚动场景采用细窄、主题化 scrollbar，并通过目标测试与构建。
