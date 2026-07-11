# Drawer Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Drawer`
- Element Plus 文档：`drawer.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### drawer.md

#### API

- `model-value / v-model`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `before-close`
- `close-on-click-modal`
- `close-on-press-escape`
- `open-delay`
- `close-delay`
- `destroy-on-close`
- `modal`
- `modal-penetrable ^`
- `direction`
- `resizable ^`
- `show-close`
- `size`
- `title`
- `with-header`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `z-index`
- `header-aria-level ^`
- `custom-class ^`
- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`
- `resize-start ^`
- `resize ^`
- `resize-end ^`
- ...另有 5 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `before-close`
- `close-on-click-modal`
- `close-on-press-escape`
- `open-delay`
- `close-delay`
- `destroy-on-close`
- `modal`
- `modal-penetrable ^`
- `direction`
- `resizable ^`
- `show-close`
- `size`
- `title`
- `with-header`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `z-index`
- `header-aria-level ^`
- `custom-class ^`

#### Events

- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`
- `resize-start ^`
- `resize ^`
- `resize-end ^`

#### Slots

- `default`
- `header`
- `footer`
- `title ^`

#### Exposes

- `handleClose`

## 当前 ElfUI API 快照

### Props

- `beforeClose`
- `closable`
- `closeOnEscape`
- `closeOnMask`
- `direction`
- `lockScroll`
- `modal`
- `open`
- `size`
- `title`

### Events

- `close`
- `closed`
- `opened`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`model-value / v-model`、`append-to-body`、`append-to ^`、`close-on-click-modal`、`close-on-press-escape`、`open-delay`、`close-delay`、`destroy-on-close`、`modal-penetrable ^`、`resizable ^`、`show-close`、`with-header`、`modal-class`、`header-class ^`、`body-class ^`、`footer-class ^`、`z-index`、`header-aria-level ^`、`custom-class ^`
- [ ] P1 补齐事件差距：`open`、`open-auto-focus`、`close-auto-focus`、`resize-start ^`、`resize ^`、`resize-end ^`
- [ ] P1 补齐插槽/暴露方法：`header`、`footer`、`title ^`、`handleClose`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
