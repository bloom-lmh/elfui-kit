# 2026-07-19 交互、字段与虚拟滚动回归

- [x] Sticky：真实浏览器验证 Teleport 内容在目标滚动容器顶部保持吸附并受边界约束。
- [x] Splitter：修复垂直模式只有数值变化、面板不移动；示例补齐确定高度与可用宽度。
- [x] Scrollbar：命令按钮移入案例标题操作区。
- [x] InputTag：接入统一 `outlined` 字段表面并同步案例。
- [x] Input：稳定 outlined 盒模型与浮动标签位置，新增 `background-color`。
- [x] Select / Autocomplete：下拉面板取消间距并与字段表面贴合。
- [x] Textarea：清空图标改为 SVG，装饰区预留空间，移除宿主方法覆盖警告。
- [x] Tour / Statistic：修复 Playground 状态槽裁切造成的按钮坍缩。
- [x] Transfer：验证长标签、Panel Footer 与窄容器纵向布局完整显示。
- [x] Progress：增减与增长速度控制移至标题区，原生 select 改为 `elf-select`。
- [x] Table：统一 Button 尺寸别名、修复 Dialog footer、表头透底、多余横向滚动和高频滚动更新。
- [x] VirtualList：增加预渲染、合并滚动更新并增加布局/绘制隔离。
- [x] ColorPicker：解除状态文本裁切，RGBA 文本完整显示。
- [x] Calendar：修正范围案例的数组 Ref 绑定，并验证重新选择起止日期。
- [x] LocaleProvider：移除“组件级英文覆盖”案例。

## 共享根因

1. `elf-button` 只识别 `sm/md/lg`，文档中的 `small/default/large` 没有命中尺寸样式。
2. Playground 标题状态槽使用 `overflow: hidden`，包含按钮或较长 RGBA 文本时会被压缩或裁切。
3. Table 列调整手柄位于单元格右侧 `-4px`，即使列宽足够也会制造 4px 横向溢出。
4. 垂直 Splitter 的百分比 flex-basis 缺少确定的父级高度，浏览器退回内容尺寸。
