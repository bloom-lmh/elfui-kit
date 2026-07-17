# Vuetify 4 工具类对齐计划

## 目标

以 Vuetify 4 当前源码为兼容基线，补齐 ElfUI 的 Light DOM 工具类契约，并将原有的静态类名列表升级为可视化、可检索、可验证的文档案例。

## 官方基线

- `packages/vuetify/src/styles/settings/_utilities.scss`：工具类属性、响应式和 RTL 配置
- `packages/vuetify/src/styles/settings/_variables.scss`：断点、间距、圆角和排版 token
- `packages/vuetify/src/styles/tools/_utilities.sass`：响应式生成规则
- `packages/vuetify/src/styles/utilities/`：显示、隐藏、无障碍、指针和高程实现

## 实施清单

- [x] 对齐 Vuetify 4 的 `sm / md / lg / xl / xxl` 断点
- [x] 对齐 0–16 间距、负 margin、逻辑方向和 `ga / gr / gc` gap
- [x] 补齐响应式 display、float、flex、order、alignment 和 sizing
- [x] 补齐边框方向、宽度、透明度、线型和逻辑圆角
- [x] 补齐 Material 3 排版阶梯、对齐、字重、装饰和换行工具
- [x] 补齐 0–5 高程、hover 高程、打印、隐藏、屏幕阅读器和 pointer helpers
- [x] 保留 `text-h*`、`elevation-6…24` 等既有别名，避免破坏现有项目
- [x] 重做 14 个工具类文档案例，加入实时断点和结构化速查表
- [x] 增加类名、声明、目录、路由和案例覆盖的契约测试
- [x] 完成浏览器视觉检查和全量回归

## 验证结果

- `pnpm test`：99 个测试文件、931 项测试全部通过
- `pnpm build`：生产构建通过
- 浏览器：14 个工具类路由、430px 窄屏、Midnight 深色主题均通过，控制台 0 error / 0 warning

## 使用边界

工具类随 ElfUI 全局样式发布，服务于应用 Light DOM。组件 Shadow DOM 内部仍通过组件属性、Provider token、公开 CSS variables 和 parts 定制，避免工具类穿透组件封装。
