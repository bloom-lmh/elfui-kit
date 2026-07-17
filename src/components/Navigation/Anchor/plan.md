# Anchor Element Plus API 对标计划

生成时间：2026-07-05
完成时间：2026-07-15

## 对标定位

- ElfUI 组件：`Navigation/Anchor`、`Navigation/AnchorLink`
- 对标 Element Plus：Anchor / AnchorLink
- 保留 ElfUI 数据源模式，并补充 Element Plus 风格的组合式子组件模式。

## 差距与任务

- [x] P1 补齐 `bound`、`duration`、`marker`、`type`、`direction`、`selectScrollTop` 属性。
- [x] P1 复核 `change`、`click` 与 `update:modelValue` 的触发时机和载荷。
- [x] P1 提供 `scrollTo` 暴露方法，并保留 `scrollToAnchor` 兼容别名。
- [x] P1 新增 `elf-anchor-link`，支持 `title`、`href`、默认插槽与 `sub-link` 插槽。
- [x] P1 支持窗口、选择器、元素和函数容器，并在容器变化时重绑监听器。
- [x] P1 同步受控/非受控状态、嵌套层级、方向与无障碍当前项。
- [x] P2 补充数据模式、受控嵌套、水平模式和组合式 AnchorLink 案例。
- [x] P2 补齐组件单测、类型导出和注册入口。

## 验收清单

- [x] API 类型、实现和页面 PropsTable 同步。
- [x] 数据模式、组合模式、点击滚动、滚动监听、禁用项、自定义字段和动态容器均有测试覆盖。
- [x] Playground 展示 Template / Script，所有动态绑定使用 `${...}`。
- [x] 构建、目标测试和真实浏览器交互通过。

## 实现说明

- `items` 是 ElfUI 的增强数据模式；默认插槽中的 `elf-anchor-link` 是对标组合模式，两种模式不会重复渲染。
- `bounds` 与 `scrollToAnchor` 作为旧版兼容别名保留，新代码建议使用 `bound` 与 `scrollTo`。
- [x] 2026-07-17 horizontal 模式为窄视口提供稳定滚动槽、主题化细滚动条和不会被滚动条遮挡的激活标记，并补充真实溢出案例。
- `duration` 为滚动行为提示；浏览器原生平滑滚动不提供精确毫秒级时长控制。
