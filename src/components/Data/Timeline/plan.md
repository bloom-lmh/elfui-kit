# Timeline Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Timeline`
- Element Plus 文档：`timeline.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### timeline.md

#### Timeline API

- `reverse ^`
- `mode ^`
- `default`

#### Timeline Attributes

- `reverse ^`
- `mode ^`

#### Timeline Slots

- `default`

#### Timeline-Item API

- `timestamp`
- `hide-timestamp`
- `center`
- `placement`
- `type`
- `color`
- `size`
- `icon`
- `hollow`
- `default`
- `dot`

#### Timeline-Item Attributes

- `timestamp`
- `hide-timestamp`
- `center`
- `placement`
- `type`
- `color`
- `size`
- `icon`
- `hollow`

#### Timeline-Item Slots

- `default`
- `dot`

## 当前 ElfUI API 快照

### Props

- `items`
- `mode`
- `reverse`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：items 数据项支持 `timestamp`、`hide-timestamp`、`center`、`placement`、`type`、`color`、`size`、`icon`、`hollow`；`start/end/alternate/alternate-reverse` 对齐 Element Plus，保留原有布局模式。
- [x] P1 补齐事件差距：Element Plus Timeline 无公开事件。
- [x] P1 补齐插槽/暴露方法：`default` 与 `dot` slot 已支持；无 expose。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。使用语义 `ol/li`，节点标记为装饰性；该组件无交互或表单状态。
- [x] P2 更新页面示例：补充 `alternate-reverse` 与 TimelineItem 节点属性案例。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。

## 2026-07-14 视觉升级

- [x] 重构节点、轨道、事件卡片与 alternate / horizontal 布局，覆盖语义色、暗色主题和窄屏回退。
- [x] 真实浏览器完成暗色主题视觉验收。

2026-07-15 验收：Timeline 定向测试通过；浏览器验证 7 个时间轴、7 组 Template/Script 及数据项内容均正常渲染，控制台无错误。
