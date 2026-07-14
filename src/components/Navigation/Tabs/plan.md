# Tabs Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/Tabs`
- Element Plus 文档：`tabs.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tabs.md

#### Tabs API

- `model-value / v-model`
- `default-value ^`
- `type`
- `closable`
- `addable`
- `editable`
- `tab-position`
- `stretch`
- `before-leave`
- `tabindex ^`
- `tab-click`
- `tab-change`
- `tab-remove`
- `tab-add`
- `edit`
- `default`
- `add-icon ^`
- `addIcon ^ ^`
- `currentName`
- `tabNavRef ^`

#### Tabs Attributes

- `model-value / v-model`
- `default-value ^`
- `type`
- `closable`
- `addable`
- `editable`
- `tab-position`
- `stretch`
- `before-leave`
- `tabindex ^`

#### Tabs Events

- `tab-click`
- `tab-change`
- `tab-remove`
- `tab-add`
- `edit`

#### Tabs Slots

- `default`
- `add-icon ^`
- `addIcon ^ ^`

#### Tabs Exposes

- `currentName`
- `tabNavRef ^`

#### Tab-nav API

- `scrollToActiveTab`
- `removeFocus`
- `tabListRef ^`
- `tabBarRef ^`

#### Tab-nav Exposes

- `scrollToActiveTab`
- `removeFocus`
- `tabListRef ^`
- `tabBarRef ^`

#### Tab-bar API

- `ref ^`
- `update ^`

#### Tab-bar Exposes

- `ref ^`
- `update ^`

#### Tab-pane API

- `label`
- `disabled`
- `closable`
- `lazy`
- `default`

#### Tab-pane Attributes

- `label`
- `disabled`
- `closable`
- `lazy`

#### Tab-pane Slots

- `default`
- `label`

## 当前 ElfUI API 快照

### Props

- `alignTabs`
- `color`
- `defaultValue`
- `density`
- `direction`
- `grow`
- `hideSlider`
- `items`
- `modelValue`
- `props`
- `showPanels`
- `stacked`
- `transition`
- `transitionDuration`

### Events

- `change`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`type`、`closable`、`addable`、`editable`、`tab-position`、`stretch`、`before-leave`、`tabindex ^`、`label`、`disabled`、`lazy`
- [ ] P1 补齐事件差距：`tab-click`、`tab-change`、`tab-remove`、`tab-add`、`edit`
- [ ] P1 补齐插槽/暴露方法：`add-icon ^`、`addIcon ^ ^`、`label`、`currentName`、`tabNavRef ^`、`scrollToActiveTab`、`removeFocus`、`tabListRef ^`、`tabBarRef ^`、`ref ^`、`update ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
## 本轮记录

- [x] 2026-07-11 Navigation 第一阶段：补 `type/closable/addable/editable/tabPosition/stretch/beforeLeave/tabindex`、`closable/lazy` item 字段、`tab-click/tab-change/tab-remove/tab-add/edit` 事件和 `setActive/removeTab/add/currentName` 暴露方法，补 card/right/editable 案例和 PropsTable。
- [x] 2026-07-14 为 card / border-card / editable 标签提供主题化滚动条；垂直可编辑标签限制为 300px 内部滚动，不再撑高面板。
