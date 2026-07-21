# 2026-07-19 虚拟滚动与 Utilities Playground 收敛修复

## 虚拟滚动

- [x] VirtualList 快速拖动滚动条时不能出现空白帧或旧窗口滞留。
- [x] Table 与 VirtualList 复用同一个固定行高窗口算法和即时窗口更新策略。
- [x] Table 连续滚动不等待 animation frame 才换窗，公开 `scroll` 事件仍需合并，避免事件风暴。
- [x] 两个组件在万级数据快速跳转后保持稳定 key、有界 DOM 数量和正确末项。

## Utilities Playground

- [x] 页面回归旧 Playground 的平直视觉，不使用渐变、大圆角、方格背景或装饰性卡片。
- [x] 每个案例标题放入 Playground header，预览保持在左侧，全部配置和操作放到右侧面板。
- [x] 分类和工具类都使用 ElfUI Select 下拉单选，不再使用顶部 tabs 和多选 checkbox。
- [x] 代码区域沿用旧 Playground 的浅色/暗色 token 风格，保留重置与复制操作。
- [x] Utilities 导航改名为“样式和动画”，作为首页后的顶层菜单项。

## 验收

- [x] 更新 VirtualList、Table、Utilities 和导航测试。
- [x] 定向测试、生产构建和组件库构建通过。
- [x] 真实浏览器验证快速拖动、Table 连续滚动、Utilities 桌面/窄屏和暗色模式。
