# Layout Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 架构与验收记录

- [x] `elf-layout` 对应 Element Plus Container：支持显式 `direction`，未显式设置时根据直接子级 `elf-aside` 自动推断方向，并在 slot 动态变化后重新计算。
- [x] Element Plus Row/Col API 由 ElfUI `elf-grid` / `elf-grid-item` 与 `elf-flex` 承担，不在应用骨架 Layout 中重复实现。
- [x] 9 项测试、生产构建及浏览器自动方向冒烟通过。

## 对标定位

- ElfUI 组件目录：`Layout/Layout`
- Element Plus 文档：`layout.md`、`container.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### layout.md

#### Row API

- `gutter`
- `justify`
- `align`
- `tag`
- `default`

#### Row Attributes

- `gutter`
- `justify`
- `align`
- `tag`

#### Row Slots

- `default`

#### Col API

- `span`
- `offset`
- `push`
- `pull`
- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `tag`
- `default`

#### Col Attributes

- `span`
- `offset`
- `push`
- `pull`
- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `tag`

#### Col Slots

- `default`

### container.md

#### Container API

- `direction`
- `default`

#### Container Attributes

- `direction`

#### Container Slots

- `default`

#### Header API

- `height`
- `default`

#### Header Attributes

- `height`

#### Header Slots

- `default`

#### Aside API

- `width`
- `default`

#### Aside Attributes

- `width`

#### Aside Slots

- `default`

#### Main API

- `default`

#### Main Slots

- `default`

#### Footer API

- `height`
- `default`

#### Footer Attributes

- `height`

#### Footer Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `direction`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成 API 归属复核：Row/Col 的栅格属性由 Grid/GridItem/Flex 提供，`height`、`width` 分属 Header/Footer 与 Aside；Layout 自身完整实现 `direction`。
- [x] P1 复核事件差距：Layout 为纯布局组件，无自定义事件契约。
- [x] P1 默认插槽已类型化，无需 expose 方法。
- [x] P1 对齐显式/自动方向同步及动态 slot 更新；交互、禁用、清空、表单和 ARIA 不适用于无交互语义的布局容器。
- [x] P2 Layout Shell 的 3 个案例均提供 Template / Script，并新增 Aside 自动横向案例。
- [x] P2 补齐组件单测、页面冒烟、类型导出和视觉验证。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步，默认方向标记为 `auto`。
- [x] 默认、显式覆盖、Aside 自动推断及动态增删有单测覆盖。
- [x] Playground Template / Script 与复制内容完整。
- [x] `pnpm build` 通过；Layout 9/9 测试通过，浏览器验证 `vertical/column → horizontal/row`。
