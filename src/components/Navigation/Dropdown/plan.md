# Dropdown Element Plus API 对标计划

生成时间：2026-07-05
最近更新：2026-07-15

## 对标定位

- ElfUI 组件：`Navigation/Dropdown`、`DropdownMenu`、`DropdownItem`
- 对标 Element Plus Dropdown 的公开属性、组合式结构、事件、暴露方法与键盘交互。
- 保留 ElfUI `items` 数据模式、嵌套子菜单、`trigger/main` 插槽和结构化 command detail 扩展。

## 已完成

- [x] 对齐 type、size、buttonProps、maxHeight、splitButton、disabled、placement、effect 与 hideOnClick。
- [x] 支持 click、hover、contextmenu 单触发或多触发数组，以及 triggerKeys、showTimeout、hideTimeout。
- [x] 支持 virtualTriggering 与 virtualRef，外部 HTMLElement 可直接响应鼠标和键盘事件。
- [x] 支持 role、tabindex、showArrow、popperClass、popperStyle、persistent 与点击外部关闭。
- [x] 新增 `elf-dropdown-menu`、`elf-dropdown-item` 及 default、dropdown、icon 插槽。
- [x] DropdownItem 支持 string、number、object command，以及 disabled、divided、icon。
- [x] 提供 handleOpen、handleClose，并保留 show、hide、toggle 兼容方法。
- [x] 数据模式和组合模式统一触发 command、visible-change，分裂按钮统一触发 click。
- [x] 覆盖禁用、保持展开、嵌套、字段映射、键盘导航、多实例互斥和虚拟触发测试。
- [x] 页面案例覆盖基础、保持展开、触发方式、兼容配置、组合式菜单和虚拟触发。

## 剩余基础设施任务

- [x] 实现共享锚定浮层：让 teleported、appendTo 和完整 popperOptions 在滚动、缩放、变换祖先及视口碰撞场景下保持准确；完成后 Dropdown 再接入真实传送行为。

## 实现说明

- `teleported` 使用原生 Popover top layer，在不搬离 Shadow DOM 的前提下脱离裁切与 transform 祖先；`appendTo` 作为目标声明保留在浮层元数据中，浏览器 top layer 负责最终承载。
- 共享 `computeAnchoredPosition` 内核处理 offset、flip、preventOverflow、visualViewport、窗口缩放和元素尺寸变化；外部滚动关闭菜单，菜单内部滚动保持可用。
- ElfUI 默认 trigger 继续使用 `click` 以保持现有版本兼容；显式传入 `hover` 可获得 Element Plus 默认交互。
- `command` 事件保留 `{ command, item }` 结构，避免破坏现有调用方；其中 command 支持 Element Plus 的 string、number 和 object。

## 本轮记录

- [x] 2026-07-15 完成共享锚定定位内核与 Dropdown top layer 接入；新增 transform + overflow 裁切案例，32 项定向单测、生产构建和真实浏览器交互通过，控制台 0 error。
- [x] 2026-07-16 修复页面滚动时菜单产生 sticky 错觉：捕获外部滚动后关闭，菜单内部滚动不误关。
