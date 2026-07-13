# Slider Element Plus API 对齐计划

更新时间：2026-07-13

## 对齐范围

- ElfUI 组件目录：`Form/Slider`
- 对标组件：Element Plus Slider
- 保持 ElfUI Web Components 与响应式宏组件实现，不复制 Vue 内部实现。

## 已完成

- [x] P0 核心属性：`show-input-controls`、`input-size`、`height`、`aria-label`、`range-start-label`、`range-end-label`、`format-value-text`、`tooltip-class`、`placement`、`validate-event`、`persistent` 和 `label`。
- [x] P0 事件：单值、范围、输入框及拖动路径都会发出 `input`；提交路径发出 `change`，且保留 `update:modelValue`。
- [x] P1 交互与可访问性：原生 range 保留键盘访问；范围两个 thumb 有独立标签和值文本；禁用、只读、受控同步及表单 change 校验已覆盖。
- [x] P1 暴露方法：`setValue(value)` 与 `clear()`。
- [x] P2 文档：补充输入控件、输入框尺寸、提示定位与辅助标签案例，并同步 Props 表。
- [x] P2 测试：覆盖范围交叉、指针拖动、marks/stops、分段吸附、禁用、ARIA 值文本、提示类名/位置以及数字输入同步。

## 兼容说明

- `persistent` 是与 Element Plus 对齐的兼容属性。ElfUI Slider 的数值提示在 `show-tooltip` 为真时始终渲染，因此不存在隐藏后销毁提示节点的额外状态。
- `input-size` 同时接受 ElfUI 的 `sm`/`md`/`lg` 与 Element Plus 风格的 `small`/`default`/`large`。

## 后续可选增强

- [ ] P2 增加浏览器级视觉回归截图，覆盖纵向滑块及四种提示位置。
- [ ] P2 在组件站点支持时，为提示内容提供专门的可访问性说明区域。

## 验收记录

- [x] API 类型、运行时 props 与 Props 表同步。
- [x] 关键交互和边界状态有组件单测覆盖。
- [x] Playground 示例使用 Template / Script 绑定语法。
- [x] `pnpm test src/components/Form/Slider/Slider.test.ts` 通过。
- [x] `pnpm build` 通过。
