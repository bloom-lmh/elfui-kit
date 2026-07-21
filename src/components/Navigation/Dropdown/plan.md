# Dropdown 对标与质量计划

## API 与交互

- [x] 支持 click、hover、contextmenu、多触发模式、分裂按钮、禁用、位置、尺寸和主题。
- [x] 支持 items 数据模式、嵌套子菜单、字段映射以及 DropdownMenu / DropdownItem 组合式模式。
- [x] 支持键盘打开、方向键、Home、End、Escape、外部点击和多实例互斥。
- [x] 支持 virtualRef、Popover top layer、碰撞翻转、外部滚动关闭和面板内部滚动。
- [x] 提供 handleOpen、handleClose、show、hide 与 toggle 方法。

## 2026-07-21 组合式选中反馈

- [x] 组合式菜单选择后同步 DropdownItem `selected` / `data-selected` / `aria-current` 状态。
- [x] 选中项提供主题化背景和 CSS 绘制的勾选图标，不使用普通字符模拟图标。
- [x] 示例触发项直接展示所选标签，状态区展示 command，不再只更新不可见内部状态。
- [x] 32 个定向测试和真实浏览器选择流程通过，控制台无错误。
- [x] 组合式菜单补充跨 Shadow DOM 键盘焦点识别，方向键跳过禁用项，重新打开后保留 `aria-current` 选中状态。
