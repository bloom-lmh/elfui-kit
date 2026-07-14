# Tree Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Tree`
- Element Plus 文档：`tree.md`、`tree-v2.md`、`tree-select.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tree.md

#### Tree API

- `data`
- `empty-text`
- `node-key`
- `props`
- `render-after-expand`
- `load`
- `render-content`
- `highlight-current`
- `default-expand-all`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `auto-expand-parent`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-node-method`
- `accordion`
- `indent`
- `icon`
- `lazy`
- `draggable`
- `allow-drag`
- `allow-drop`
- `label`
- `children`
- `disabled`
- `isLeaf`
- `class`
- `filter`
- `updateKeyChildren`
- `getCheckedNodes`
- ...另有 30 项，详见来源文档

#### Attributes

- `data`
- `empty-text`
- `node-key`
- `props`
- `render-after-expand`
- `load`
- `render-content`
- `highlight-current`
- `default-expand-all`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `auto-expand-parent`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-node-method`
- `accordion`
- `indent`
- `icon`
- `lazy`
- `draggable`
- `allow-drag`
- `allow-drop`

#### props

- `label`
- `children`
- `disabled`
- `isLeaf`
- `class`

#### Exposes

- `filter`
- `updateKeyChildren`
- `getCheckedNodes`
- `setCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- `setCurrentNode`
- `getNode`
- `remove`
- `append`
- `insertBefore`
- `insertAfter`

#### Events

- `node-click`
- `node-contextmenu`
- `check-change`
- `check`
- `current-change`
- `node-expand`
- `node-collapse`
- `node-drag-start`
- `node-drag-enter`
- `node-drag-leave`
- `node-drag-over`
- `node-drag-end`
- `node-drop`

#### Slots

- `default`
- `empty ^`

### tree-v2.md

#### TreeV2 API

- `data`
- `empty-text`
- `props`
- `highlight-current`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-method`
- `indent`
- `icon`
- `item-size ^`
- `scrollbar-always-on ^`
- `height`
- `value`
- `label`
- `children`
- `disabled`
- `class ^`
- `filter`
- `getCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `setExpandedKeys`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- ...另有 16 项，详见来源文档

#### TreeV2 Attributes

- `data`
- `empty-text`
- `props`
- `highlight-current`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-method`
- `indent`
- `icon`
- `item-size ^`
- `scrollbar-always-on ^`
- `height`

#### props

- `value`
- `label`
- `children`
- `disabled`
- `class ^`

#### TreeV2 Exposes

- `filter`
- `getCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `setExpandedKeys`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- `getNode`
- `expandNode`
- `collapseNode`
- `setData`
- `scrollTo ^`
- `scrollToNode ^`

#### TreeV2 Events

- `node-click`
- `node-drop ^`
- `node-contextmenu`
- `check-change`
- `check`
- `current-change`
- `node-expand`
- `node-collapse`

#### TreeV2 Slots

- `default`
- `empty ^`

### tree-select.md

#### API

- `Attributes`
- `tree`
- `select`
- `cache-data ^`
- `treeRef ^`
- `selectRef ^`
- `filter ^`
- `updateKeyChildren ^`
- `getCheckedNodes ^`
- `setCheckedNodes ^`
- `getCheckedKeys ^`
- `setCheckedKeys ^`
- `setChecked ^`
- `getHalfCheckedNodes ^`
- `getHalfCheckedKeys ^`
- `getCurrentKey ^`
- `getCurrentNode ^`
- `setCurrentKey ^`
- `setCurrentNode ^`
- `getNode ^`
- `remove ^`
- `append ^`
- `insertBefore ^`
- `insertAfter ^`
- `focus ^`
- `blur ^`
- `selectedLabel ^ ^`

#### Attributes

- `Attributes`
- `tree`
- `select`
- `cache-data ^`

#### Own Attributes

- `cache-data ^`

#### Exposes

- `treeRef ^`
- `selectRef ^`
- `filter ^`
- `updateKeyChildren ^`
- `getCheckedNodes ^`
- `setCheckedNodes ^`
- `getCheckedKeys ^`
- `setCheckedKeys ^`
- `setChecked ^`
- `getHalfCheckedNodes ^`
- `getHalfCheckedKeys ^`
- `getCurrentKey ^`
- `getCurrentNode ^`
- `setCurrentKey ^`
- `setCurrentNode ^`
- `getNode ^`
- `remove ^`
- `append ^`
- `insertBefore ^`
- `insertAfter ^`
- `focus ^`
- `blur ^`
- `selectedLabel ^ ^`

## 当前 ElfUI API 快照

### Props

- `accordion`
- `checkOnClickNode`
- `checkStrictly`
- `checkedKeys`
- `currentNodeKey`
- `data`
- `defaultCheckedKeys`
- `defaultExpandAll`
- `defaultExpandedKeys`
- `defaultSelectedKey`
- `emptyText`
- `expandOnClickNode`
- `expandedKeys`
- `filterPlaceholder`
- `filterable`
- `highlightCurrent`
- `indent`
- `modelValue`
- `nodeKey`
- `props`
- `showCheckbox`

### Events

- `check`
- `check-change`
- `node-click`
- `node-collapse`
- `node-expand`
- `update:checkedKeys`
- `update:expandedKeys`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`render-after-expand`、`load`、`render-content`、`check-on-click-leaf ^`、`auto-expand-parent`、`filter-node-method`、`icon`、`lazy`、`draggable`、`allow-drag`、`allow-drop`、`label`、`children`、`disabled`、`isLeaf`、`class`、`filter-method`、`item-size ^`、`scrollbar-always-on ^`、`height`、`value`、`class ^`、`Attributes`、`tree`、`select`、`cache-data ^`
- [ ] P1 补齐事件差距：`node-contextmenu`、`current-change`、`node-drag-start`、`node-drag-enter`、`node-drag-leave`、`node-drag-over`、`node-drag-end`、`node-drop`、`node-drop ^`
- [ ] P1 补齐插槽/暴露方法：`empty ^`、`filter`、`updateKeyChildren`、`getCheckedNodes`、`setCheckedNodes`、`getCheckedKeys`、`setCheckedKeys`、`setChecked`、`getHalfCheckedNodes`、`getHalfCheckedKeys`、`getCurrentKey`、`getCurrentNode`、`setCurrentKey`、`setCurrentNode`、`getNode`、`remove`、`append`、`insertBefore`、`insertAfter`、`setExpandedKeys`、`expandNode`、`collapseNode`、`setData`、`scrollTo ^` 等 48 项
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-14 体验修复

- [x] 树体滚动条改为细窄主题样式；权限树操作与状态合并到案例标题行。
