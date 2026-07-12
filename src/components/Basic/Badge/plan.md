# Badge Element Plus API 对标计划

## 本轮记录
- [x] 第二阶段：补 `offset`、`badge-style`、`badge-class`、`content` 与 `content` slot 基础能力和页面示例。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Badge`
- Element Plus 文档：`badge.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### badge.md

#### API

- `value`
- `max`
- `is-dot`
- `hidden`
- `type`
- `show-zero ^`
- `color ^`
- `offset ^`
- `badge-style ^`
- `badge-class ^`
- `default`
- `content ^`

#### Attributes

- `value`
- `max`
- `is-dot`
- `hidden`
- `type`
- `show-zero ^`
- `color ^`
- `offset ^`
- `badge-style ^`
- `badge-class ^`

#### Slots

- `default`
- `content ^`

## 当前 ElfUI API 快照

### Props

- `color`
- `hidden`
- `isDot`
- `max`
- `showZero`
- `type`
- `value`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`offset ^`、`badge-style ^`、`badge-class ^`
- [ ] P1 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
- [ ] P1 补齐插槽/暴露方法：`content ^`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
