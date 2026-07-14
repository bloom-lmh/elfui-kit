# Flex Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 架构与验收记录

- [x] 补齐 Space 兼容输入：`alignment`、`size`、`fill`、`fill-ratio`，支持预设、CSS 长度、像素数值和 `[水平, 垂直]` 元组间距。
- [x] 所有布局状态通过 host attribute/CSS variable 响应 property 更新；`fill-ratio` 使用 border-box 精确约束子项占比。
- [x] 7 项单测、生产构建与浏览器布局验收通过。

## 对标定位

- ElfUI 组件目录：`Layout/Flex`
- Element Plus 文档：`space.md`、`layout.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### space.md

#### API

- `alignment`
- `class`
- `direction`
- `prefix-cls`
- `style`
- `spacer`
- `size`
- `wrap`
- `alignment`
- `size`
- `inline`
- `fill`
- `fillRatio`
- `fill`
- `fill-ratio`
- `default`

#### Attributes

- `alignment`
- `class`
- `direction`
- `prefix-cls`
- `style`
- `spacer`
- `size`
- `wrap`
- `fill`
- `fill-ratio`

#### Slots

- `default`

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

## 当前 ElfUI API 快照

### Props

- `align`
- `direction`
- `gap`
- `justify`
- `wrap`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐 Flex/Space 归属属性：`alignment`、`size`、`fill`、`fill-ratio`；`class/style` 为原生宿主属性，Shadow DOM 不需要 `prefix-cls`，自定义分隔内容继续使用子项/slot 组合而非破坏原生 slot。
- [x] P1 完成 Row/Col 属性归属复核：`gutter` 由 Grid/Flex gap 提供，`span/offset/push/pull/xs~xl` 属于 GridItem，`tag` 不适用于固定 Custom Element 标签。
- [x] P1 复核事件差距：Flex 为纯布局组件，无自定义事件契约。
- [x] P1 默认插槽已类型化，无需 expose；交互、禁用、清空、表单和 ARIA 不适用于无交互语义的布局容器。
- [x] P2 6 个页面案例均提供 Template / Script，新增 alignment/size/fill-ratio 案例。
- [x] P2 补齐单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 预设/数值/元组间距、兼容别名、动态宿主状态和 fill ratio 边界有单测覆盖。
- [x] Playground Template / Script 与复制内容完整。
- [x] `pnpm build` 通过；Flex 7/7 测试通过，浏览器验证 gap=12px、元组 20×8px、子项总宽度精确为 45%。
