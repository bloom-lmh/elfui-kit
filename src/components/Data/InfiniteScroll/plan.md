# InfiniteScroll Element Plus API 对标计划

生成时间：2026-07-05

## 第一批实现

- [x] 基础 props：`disabled`、`distance`、`immediate`、`loading`。
- [x] 基础 event：`load`。
- [x] 接入 Data 注册和单测。

## 后续差距

- [x] 2026-07-15：基于 ElfUI 全局指令运行时实现 `v-infinite-scroll`，对齐 `infinite-scroll-disabled`、`infinite-scroll-distance`、`infinite-scroll-delay`、`infinite-scroll-immediate`，并补齐更新与销毁清理；8 项组件/指令测试、生产构建和浏览器滚动冒烟均通过。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、distance、loading、load、disabled 和 immediate 示例。
- [x] 新增任意滚动容器的指令案例，真实滚动验证从 8 条加载到 12 条，控制台无错误。
