# Playground Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Common/Playground`
- Element Plus 文档：无直接对标，按内部基础设施组件维护。
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

- 无直接公开 API 对标。

## 当前 ElfUI API 快照

### Props

- `code`
- `script`
- `title`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P2 明确内部组件职责边界，保证 Playground/PropsTable 等文档基础设施不泄漏为 Element Plus 对外组件。
- [ ] P2 补齐自身 props、事件、样式变量与测试说明，服务所有组件示例。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
