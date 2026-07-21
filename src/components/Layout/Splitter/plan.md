# Splitter Element Plus API 对标计划

## 2026-07-19 垂直拖拽回归
- [x] 为垂直模式建立确定高度并扩大横向命中区，百分比与实际面板尺寸同步
- [x] 面板默认隐藏原生 overflow；真实浏览器验证垂直分割条可从 48% 拖到 71%，且两侧不出现原生滚动条

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Layout/Splitter`
- Element Plus 文档：`splitter.md`

## 第一批实现

- [x] 基础 props：`model-value`、`min`、`max`、`vertical`、`disabled`。
- [x] 基础 events：`update:modelValue`、`change`、`resize-start`、`resize-end`。
- [x] 基础 slots：`first`、`second`。

## 本轮修复（2026-07-13）

- [x] 修复拖拽失效：使用 `setPointerCapture` 确保指针离开 bar 后继续跟踪。
- [x] 修复 pointermove/pointerup 事件绑定位置：从 `.splitter` 容器移至 bar 元素，配合 pointer capture 工作。
- [x] 修复 `modelValue=0` / `min=0` 的 falsy 判断 bug（`||` 改为 `isNaN` 判读）。
- [x] 移除 `onPointerMove` 中冗余的 `querySelector`。
- [x] 新增键盘支持：方向键调整分割比例，步长 5%。
- [x] 新增 ARIA 属性：`aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-orientation`。
- [x] 新增 `lostpointercapture` 处理。
- [x] 修复 SCSS 中未定义的 CSS 变量（`--elf-bg` → `--elf-bg-paper`，`--elf-bg-muted` → `--elf-border`）。
- [x] 补齐 13 条单元测试。

## 后续差距

- [x] 对齐 Element Plus Panel 子组件、collapsible、resizable、lazy、持久化尺寸。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 2026-07-15 验收

- [x] 新增 `elf-splitter-panel`，保留原 `first/second` 插槽兼容；尺寸、拖拽、键盘、折叠与存储统一由 Splitter 状态管理。
- [x] 19 项专项测试通过，覆盖 Panel 边界、折叠恢复、非 resizable、lazy 激活、持久化与折叠按钮指针隔离。
- [x] 真实浏览器验证初始 34%、折叠 0%、localStorage 写入和展开按钮，控制台无错误；生产构建通过。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、水平/垂直分割、min/max、受控比例和 disabled 示例。
