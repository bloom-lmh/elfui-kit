# Tooltip Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Tooltip`
- Element Plus 文档：`tooltip.md`、`popover.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tooltip.md

#### API

- `append-to`
- `effect`
- `content`
- `raw-content`
- `placement`
- `fallback-placements`
- `visible / v-model:visible`
- `disabled`
- `offset`
- `transition`
- `popper-options`
- `arrow-offset ^`
- `show-after`
- `show-arrow`
- `hide-after`
- `auto-close`
- `popper-class`
- `popper-style`
- `enterable`
- `teleported`
- `trigger`
- `virtual-triggering`
- `virtual-ref`
- `trigger-keys`
- `persistent`
- `aria-label ^`
- `focus-on-target ^`
- `before-show`
- `show`
- `before-hide`
- `hide`
- `default`
- `popperRef`
- `contentRef`
- ...另有 4 项，详见来源文档

#### Attributes

- `append-to`
- `effect`
- `content`
- `raw-content`
- `placement`
- `fallback-placements`
- `visible / v-model:visible`
- `disabled`
- `offset`
- `transition`
- `popper-options`
- `arrow-offset ^`
- `show-after`
- `show-arrow`
- `hide-after`
- `auto-close`
- `popper-class`
- `popper-style`
- `enterable`
- `teleported`
- `trigger`
- `virtual-triggering`
- `virtual-ref`
- `trigger-keys`
- `persistent`
- `aria-label ^`
- `focus-on-target ^`

#### Events

- `before-show`
- `show`
- `before-hide`
- `hide`

#### Slots

- `default`
- `content`

#### Exposes

- `popperRef`
- `contentRef`
- `isFocusInsideContent`
- `updatePopper`
- `onOpen`
- `onClose`
- `hide`

### popover.md

#### API

- `trigger`
- `trigger-keys ^`
- `title`
- `effect`
- `content`
- `width`
- `placement`
- `disabled`
- `visible / v-model:visible`
- `offset`
- `transition`
- `show-arrow`
- `popper-options`
- `popper-class`
- `popper-style`
- `show-after`
- `hide-after`
- `auto-close`
- `tabindex`
- `teleported`
- `append-to ^`
- `persistent`
- `virtual-triggering`
- `virtual-ref`
- `tooltip`
- `default`
- `reference`
- `show`
- `before-enter`
- `after-enter`
- `hide`
- `before-leave`
- `after-leave`

#### Attributes

- `trigger`
- `trigger-keys ^`
- `title`
- `effect`
- `content`
- `width`
- `placement`
- `disabled`
- `visible / v-model:visible`
- `offset`
- `transition`
- `show-arrow`
- `popper-options`
- `popper-class`
- `popper-style`
- `show-after`
- `hide-after`
- `auto-close`
- `tabindex`
- `teleported`
- `append-to ^`
- `persistent`
- `virtual-triggering`
- `virtual-ref`
- `tooltip`

#### Slots

- `default`
- `reference`

#### Events

- `show`
- `before-enter`
- `after-enter`
- `hide`
- `before-leave`
- `after-leave`

#### Exposes

- `hide`

## 当前 ElfUI API 快照

### Props

- `content`
- `disabled`
- `effect`
- `hideAfter`
- `placement`
- `showAfter`
- `trigger`
- `visible`

### Events

- 暂无记录

### Slots

- `content`
- `default`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`append-to`、`raw-content`、`fallback-placements`、`offset`、`transition`、`popper-options`、`arrow-offset ^`、`show-arrow`、`auto-close`、`popper-class`、`popper-style`、`enterable`、`teleported`、`virtual-triggering`、`virtual-ref`、`trigger-keys`、`persistent`、`aria-label ^`、`focus-on-target ^`、`trigger-keys ^`、`title`、`width`、`tabindex`、`append-to ^`、`tooltip`
- [ ] P1 补齐事件差距：`before-show`、`show`、`before-hide`、`hide`、`before-enter`、`after-enter`、`before-leave`、`after-leave`
- [ ] P1 补齐插槽/暴露方法：`reference`、`popperRef`、`contentRef`、`isFocusInsideContent`、`updatePopper`、`onOpen`、`onClose`、`hide`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
