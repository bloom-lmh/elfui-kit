# List / VirtualList 组件计划

## 2026-07-17 首版完成

- [x] `elf-list` 提供稳定 key、自定义渲染器、边框、分隔线和空状态。
- [x] `elf-virtual-list` 提供固定行高窗口化、overscan、稳定滚动空间和公开定位方法。
- [x] 窗口计算抽为 `computeVirtualWindow`，与 Table 大数据模式复用。
- [x] 覆盖 10,000 项案例、边界计算、DOM 数量和滚动换窗测试。

动态行高需要 ResizeObserver、前缀和缓存及滚动锚定，后续作为独立能力扩展，不混入本次固定行高契约。
