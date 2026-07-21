# InputTag Element Plus API 对标计划

## 2026-07-19 字段表面
- [x] 接入统一 FieldVariant，并以 outlined 作为标签输入默认外观
- [x] 保持标签关闭操作和多行换行语义，案例不退化为普通文本输入框
- [x] 输入区与标签共用自动换行容器；中间项删除使用稳定 key，360px 下无横向溢出

## 本轮记录

- [x] 2026-07-16 标签渲染复用 `elf-tag`，统一 type/effect/size/round/close 视觉与事件语义，并保留拖拽排序和受控数组行为。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/InputTag`
- Element Plus 文档：`input-tag.md`

## 第一批实现

- [x] 基础 props：`model-value`、`placeholder`、`disabled`、`readonly`、`clearable`、`max`、`size`。
- [x] 基础 events：`update:modelValue`、`change`、`input`、`add-tag`、`remove-tag`、`clear`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 补齐 trigger、tag-type、tag-effect、draggable、validate-event、suffix/prefix slot。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、受控数组、clearable、max、size、只读和禁用示例。
