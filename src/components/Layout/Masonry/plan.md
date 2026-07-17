# Masonry 布局计划

## 2026-07-17 首版

- [x] 支持最大列数、最小列宽与主题间距 token。
- [x] 使用原生 CSS columns 实现响应式瀑布流，不测量或搬运用户 DOM。
- [x] 子项使用 `break-inside: avoid` 保持卡片完整。
- [x] 补齐测试、案例、注册、路由与公开类型。

需要保持视觉顺序严格横向排列的场景应使用 Grid；Masonry 的阅读顺序遵循 CSS columns 的纵向流。
