# Transfer Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Transfer`
- Element Plus 文档：`transfer.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### transfer.md

#### Transfer API

- `model-value / v-model`
- `data`
- `filterable`
- `filter-placeholder`
- `filter-method`
- `target-order`
- `titles`
- `button-texts`
- `render-content`
- `format`
- `props`
- `left-default-checked`
- `right-default-checked`
- `validate-event`
- `virtual-scroll ^`
- `item-size ^`
- `change`
- `left-check-change`
- `right-check-change`
- `default`
- `left-footer`
- `right-footer`
- `left-empty ^`
- `right-empty ^`
- `clearQuery`
- `leftPanel`
- `rightPanel`

#### Transfer Attributes

- `model-value / v-model`
- `data`
- `filterable`
- `filter-placeholder`
- `filter-method`
- `target-order`
- `titles`
- `button-texts`
- `render-content`
- `format`
- `props`
- `left-default-checked`
- `right-default-checked`
- `validate-event`
- `virtual-scroll ^`
- `item-size ^`

#### Transfer Events

- `change`
- `left-check-change`
- `right-check-change`

#### Transfer Slots

- `default`
- `left-footer`
- `right-footer`
- `left-empty ^`
- `right-empty ^`

#### Transfer Exposes

- `clearQuery`
- `leftPanel`
- `rightPanel`

#### Transfer Panel API

- `query`

#### Transfer Panel Exposes

- `query`

## 当前 ElfUI API 快照

### Props

- `data`
- `filterPlaceholder`
- `filterable`
- `modelValue`
- `props`
- `titles`

### Events

- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`filter-method`、`target-order`、`button-texts`、`render-content`、`format`、`left-default-checked`、`right-default-checked`、`validate-event`、`virtual-scroll ^`、`item-size ^`
- [ ] P1 补齐事件差距：`change`、`left-check-change`、`right-check-change`
- [ ] P1 补齐插槽/暴露方法：`left-footer`、`right-footer`、`left-empty ^`、`right-empty ^`、`clearQuery`、`leftPanel`、`rightPanel`、`query`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
