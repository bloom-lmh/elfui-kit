# Dropdown Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/Dropdown`
- Element Plus 文档：`dropdown.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### dropdown.md

#### Dropdown API

- `type`
- `size`
- `button-props`
- `max-height`
- `split-button`
- `disabled`
- `placement`
- `effect`
- `trigger`
- `trigger-keys ^`
- `virtual-triggering ^`
- `virtual-ref ^`
- `hide-on-click`
- `show-arrow ^`
- `show-timeout`
- `hide-timeout`
- `role`
- `tabindex`
- `popper-class`
- `popper-style ^`
- `popper-options`
- `teleported ^`
- `append-to ^`
- `persistent ^`
- `default`
- `dropdown`
- `click`
- `command`
- `visible-change`
- `handleOpen`
- `handleClose`

#### Dropdown Attributes

- `type`
- `size`
- `button-props`
- `max-height`
- `split-button`
- `disabled`
- `placement`
- `effect`
- `trigger`
- `trigger-keys ^`
- `virtual-triggering ^`
- `virtual-ref ^`
- `hide-on-click`
- `show-arrow ^`
- `show-timeout`
- `hide-timeout`
- `role`
- `tabindex`
- `popper-class`
- `popper-style ^`
- `popper-options`
- `teleported ^`
- `append-to ^`
- `persistent ^`

#### Dropdown Slots

- `default`
- `dropdown`

#### Dropdown Events

- `click`
- `command`
- `visible-change`

#### Dropdown Exposes

- `handleOpen`
- `handleClose`

#### Dropdown-Menu API

- `default`

#### Dropdown-Menu Slots

- `default`

#### Dropdown-Item API

- `command`
- `disabled`
- `divided`
- `icon`
- `default`
- `icon ^`

#### Dropdown-Item Attributes

- `command`
- `disabled`
- `divided`
- `icon`

#### Dropdown-Item Slots

- `default`
- `icon ^`

## 当前 ElfUI API 快照

### Props

- `disabled`
- `hideOnClick`
- `items`
- `label`
- `maxHeight`
- `placement`
- `props`
- `size`
- `splitButton`
- `trigger`

### Events

- `click`
- `command`
- `visible-change`

### Slots

- `main`
- `trigger`

### Exposes

- 暂无记录

## 差距与任务

- [ ] P1 补齐核心属性差距：`type`、`button-props`、`effect`、`trigger-keys ^`、`virtual-triggering ^`、`virtual-ref ^`、`show-arrow ^`、`show-timeout`、`hide-timeout`、`role`、`tabindex`、`popper-class`、`popper-style ^`、`popper-options`、`teleported ^`、`append-to ^`、`persistent ^`、`command`、`divided`、`icon`
- [ ] P1 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
- [ ] P1 补齐插槽/暴露方法：`dropdown`、`icon ^`、`handleOpen`、`handleClose`
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
## 本轮记录

- [x] 2026-07-11 Navigation 第一阶段：补 `type/buttonProps/effect/triggerKeys/showArrow/showTimeout/hideTimeout/role/tabindex/popperClass/popperStyle/persistent/closeOnClickOutside` 兼容入口，新增 `handleOpen/handleClose` 暴露方法，补键盘触发、非持久面板、popper 样式和页面案例。
