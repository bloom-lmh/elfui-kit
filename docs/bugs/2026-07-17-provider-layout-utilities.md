# Provider、布局与工具类升级计划

日期：2026-07-17

## 目标

- [x] DatePicker、Autocomplete 等复合输入组件统一支持 `default`、`outlined`、`underlined`、`solo`、`solo-filled`、`solo-inverted`。
- [x] 使用 `LocaleProvider` 为文档应用提供中英文切换，并在 Header 暴露切换入口。
- [x] 使用 `ThemeProvider` 提供 Material、Midnight、Forest、Sunset 四套皮肤，并在 Header 暴露切换入口。
- [x] 新增响应式 Masonry 瀑布流组件，升级 Flex、Grid 为更直观的真实业务案例。
- [x] 新增 Utilities 工具类菜单，覆盖边框、圆角、内容、光标、显示、高程、Flex、Float、透明度、溢出、位置、尺寸、间距和排版。
- [x] 完成组件单测、生产构建和浏览器交互验收。

## 第二阶段：组件英文覆盖

- [x] 扩充 `zh-CN` / `en-US` 内置组件文案目录。
- [x] 清除表单、选择器、数据、反馈和导航组件的硬编码默认中文。
- [x] 显式文案 prop 与 slot 优先于 Provider 默认文案。
- [x] 增加中英文组件矩阵案例与 LocaleProvider 回归测试。
- [x] 通过硬编码扫描、全量测试、生产构建和浏览器验收。

## 设计约束

- 工具类服务于应用 Light DOM，采用可组合的原子类和 `!important`，不穿透组件 Shadow DOM。
- Shadow DOM 组件继续通过 Provider token、组件属性和公开 CSS variables 定制。
- 间距与方向类使用 `start/end` 逻辑方向，兼容 `LocaleProvider` 的 RTL 场景。
- 皮肤切换只替换语义 token，不在组件内硬编码主题分支。

## Vuetify 调研依据

- Flex helpers: https://v2.vuetifyjs.com/en/styles/flex/
- Display helpers: https://vuetifyjs.com/en/styles/display/
- Spacing helpers: https://vuetifyjs.com/en/styles/spacing/
- Elevation helpers: https://v2.vuetifyjs.com/en/styles/elevation/
- Theme provider: https://v2.vuetifyjs.com/en/features/theme/
