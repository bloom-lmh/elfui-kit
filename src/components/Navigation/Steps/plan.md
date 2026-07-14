# Steps Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/Steps`
- Element Plus 文档：`steps.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### steps.md

#### Steps API

- `space`
- `direction`
- `active`
- `process-status`
- `finish-status`
- `align-center`
- `simple`
- `change`
- `default`

#### Steps Attributes

- `space`
- `direction`
- `active`
- `process-status`
- `finish-status`
- `align-center`
- `simple`

#### Steps Events

- `change`

#### Steps Slots

- `default`

#### Step API

- `title`
- `icon`
- `status`

#### Step Attributes

- `title`
- `icon`
- `status`

#### Step Slots

- `icon`
- `title`

## 当前 ElfUI API 快照

### Props

- `active`
- `alternativeLabel`
- `clickable`
- `direction`
- `items`
- `size`

### Events

- `update:active`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`space`、`process-status`、`finish-status`、`align-center`、`simple`、`title`、`icon`、`status`
- [ ] P1 补齐事件差距：`change`
- [ ] P1 补齐插槽/暴露方法：`icon`、`title`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
## 本轮记录

- [x] 2026-07-11 Navigation 第一阶段：补 `space/processStatus/finishStatus/alignCenter/simple` 属性、状态推断和样式，补对应单测、PropsTable 与案例。
- [x] 2026-07-14 使用内容背景隔离连接线；水平步骤保持可读最小宽度并在窄内容区内部滚动。
