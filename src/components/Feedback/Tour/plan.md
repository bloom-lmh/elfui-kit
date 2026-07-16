# Tour Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Tour`
- Element Plus 文档：`tour.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tour.md

#### Tour API

- `Property`
- `append-to`
- `show-arrow`
- `placement`
- `content-style`
- `mask`
- `gap`
- `type`
- `model-value / v-model`
- `current / v-model:current`
- `scroll-into-view-options`
- `z-index`
- `show-close`
- `close-icon`
- `close-on-press-escape`
- `target-area-clickable`
- `default`
- `indicators`
- `close`
- `finish`
- `change`

#### Tour Attributes

- `Property`
- `append-to`
- `show-arrow`
- `placement`
- `content-style`
- `mask`
- `gap`
- `type`
- `model-value / v-model`
- `current / v-model:current`
- `scroll-into-view-options`
- `z-index`
- `show-close`
- `close-icon`
- `close-on-press-escape`
- `target-area-clickable`

#### Tour slots

- `default`
- `indicators`

#### Tour events

- `close`
- `finish`
- `change`

#### TourStep API

- `Property`
- `target`
- `show-arrow`
- `title`
- `placement`
- `content-style`
- `mask`
- `type`
- `next-button-props`
- `prev-button-props`
- `scroll-into-view-options`
- `show-close`
- `close-icon`
- `default`
- `header`
- `close`

#### TourStep Attributes

- `Property`
- `target`
- `show-arrow`
- `title`
- `placement`
- `content-style`
- `mask`
- `type`
- `next-button-props`
- `prev-button-props`
- `scroll-into-view-options`
- `show-close`
- `close-icon`

#### TourStep slots

- `default`
- `header`

#### TourStep events

- `close`

## 当前 ElfUI API 快照

### Props

- `current`
- `gap`
- `keyboard`
- `lockScroll`
- `maskClosable`
- `steps`
- `visible`
- `zIndex`

### Events

- `update:current`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`Property`、`append-to`、`show-arrow`、`placement`、`content-style`、`mask`、`type`、`model-value / v-model`、`scroll-into-view-options`、`show-close`、`close-icon`、`close-on-press-escape`、`target-area-clickable`、`target`、`title`、`next-button-props`、`prev-button-props`
- [ ] P1 补齐事件差距：`close`、`finish`、`change`
- [ ] P1 补齐插槽/暴露方法：`indicators`、`header`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-16 首步键盘回归

- [x] Teleport 层使用实例级稳定 ID，首轮模板 ref 尚未建立时仍能精确聚焦当前 Tour 的关闭按钮。
- [x] 键盘监听覆盖打开生命周期，首步无需鼠标交互即可使用方向键；避免遮罩与全局监听重复驱动步骤。
- [x] 键盘案例的状态和启动操作移动到 Playground 标题行。
- [x] 7 项定向测试、构建及暗色真实浏览器方向键 / Esc / 焦点检查通过，控制台无错误和警告。
