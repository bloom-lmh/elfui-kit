# Collapse Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Collapse`
- Element Plus 文档：`collapse.md`

## 第一批实现

- [x] 基础 props：`model-value`、`accordion`、`items`、`props`。
- [x] 基础 events：`update:modelValue`、`change`。
- [x] 支持禁用项、受控回显和手风琴输出。

## 后续差距

- [ ] 拆出 CollapseItem 子组件、补 title/default/icon slots 和 expose。当前数据驱动 Collapse 已补齐原生 button 键盘访问、受控同步、disabled 行为和 aria region 关联。
- [x] 页面示例补 Template / Script 双视图和 PropsTable，并增加字段映射案例。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、多面板受控、禁用项和 accordion 示例。
