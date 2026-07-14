# Button Element Plus API 对标计划

## 本轮记录
- [x] 第二阶段：补 `type` 语义色兼容、`native-type`、`text`、`bg`、`link`、`round`、`circle`、`icon`、`loading-icon`、`dark`、`direction` 基础行为和页面示例。
- [x] 第三阶段：修复 handleClick 逻辑反写（disabled/loading 才阻止事件）；新增 noHover 属性禁用 hover 效果；补齐 defineExpose（size/type/disabled）；补齐 host flag（block/plain/dashed/no-hover）；补齐单测 25 条覆盖所有状态。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Button`
- Element Plus 文档：`button.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### button.md

#### Button API

- `size`
- `type`
- `plain`
- `text ^`
- `bg ^`
- `link ^`
- `round`
- `circle`
- `dashed ^`
- `loading`
- `loading-icon`
- `disabled`
- `icon`
- `autofocus`
- `native-type`
- `auto-insert-space`
- `color`
- `dark`
- `tag ^`
- `default`
- `ref`
- `shouldAddSpace`

#### Button Attributes

- `size`
- `type`
- `plain`
- `text ^`
- `bg ^`
- `link ^`
- `round`
- `circle`
- `dashed ^`
- `loading`
- `loading-icon`
- `disabled`
- `icon`
- `autofocus`
- `native-type`
- `auto-insert-space`
- `color`
- `dark`
- `tag ^`

#### Button Slots

- `default`
- `loading`
- `icon`

#### Button Exposes

- `ref`
- `size`
- `type`
- `disabled`
- `shouldAddSpace`

#### ButtonGroup API

- `size`
- `type`
- `direction ^`
- `default`

#### ButtonGroup Attributes

- `size`
- `type`
- `direction ^`

#### ButtonGroup Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `autofocus`
- `autoInsertSpace`
- `bg`
- `block`
- `circle`
- `color`
- `dark`
- `dashed`
- `direction`
- `disabled`
- `form`
- `icon`
- `link`
- `loading`
- `loadingIcon`
- `nativeType`
- `noHover` — 禁用 hover 效果
- `plain`
- `round`
- `shape`
- `size`
- `tag`
- `text`
- `type`

### Events

- `click`

### Slots

- `default`
- `icon`
- `suffix-icon`
- `loading`

### Exposes

- `size`
- `type` — 原生 button type
- `disabled`

## 差距与任务

- [x] P1 补齐核心属性差距：所有 props 已对齐 Element Plus + 新增 noHover。
- [x] P1 补齐事件差距：handleClick 已修复（disabled/loading 阻止 click 冒泡）。
- [x] P1 补齐插槽/暴露方法：loading/icon/suffix-icon slot；defineExpose 暴露 size/type/disabled。
- [x] P1 对齐交互行为：disabled/loading/noHover/block 状态完整。
- [x] P2 更新页面示例：全部案例已统一为 Template/Script 双视图，并校正展示源码与实际渲染内容。
- [x] P2 补齐组件单测：25 条测试覆盖所有 props/flags/slots/expose/事件。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例 Playground 已统一刷新。
- [x] `pnpm build` 通过。

2026-07-15 验收：Button 25 条定向测试通过；浏览器验证 37 个按钮、12 组 Template/Script、禁用及 loading 状态均正常，控制台无错误。
