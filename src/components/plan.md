# ui-kit Components Element Plus 全量对标计划

生成时间：2026-07-05

## 范围

- 本目录下已为 83 个现有组件目录生成或更新 `plan.md`。
- 每份组件计划包含 Element Plus API 摘要、当前 ElfUI API 快照、差距任务和验收清单。
- 后续实现顺序：先 Form/Picker/Feedback 的用户阻塞问题，再 Navigation/Data/Layout，最后 Basic/Providers 与内部文档组件。

## 现有组件目录

- [ ] `Basic/Avatar`
- [ ] `Basic/Badge`
- [ ] `Basic/Button`
- [ ] `Basic/Icon`
- [ ] `Basic/Link`
- [ ] `Basic/Tag`
- [ ] `Basic/Text`
- [ ] `Common/Playground`
- [ ] `Common/PropsTable`
- [ ] `Data/Card`
- [ ] `Data/Carousel`
- [ ] `Data/Collapse`
- [ ] `Data/Descriptions`
- [ ] `Data/Divider`
- [ ] `Data/Empty`
- [ ] `Data/Image`
- [ ] `Data/InfiniteScroll`
- [ ] `Data/Pagination`
- [ ] `Data/Progress`
- [ ] `Data/Result`
- [ ] `Data/Skeleton`
- [ ] `Data/Statistic`
- [ ] `Data/Table`
- [ ] `Data/Timeline`
- [ ] `Data/Transfer`
- [ ] `Data/Tree`
- [ ] `Data/Watermark`
- [ ] `Feedback/Alert`
- [ ] `Feedback/Dialog`
- [ ] `Feedback/Drawer`
- [ ] `Feedback/Loading`
- [ ] `Feedback/Message`
- [ ] `Feedback/Notification`
- [ ] `Feedback/PopConfirm`
- [ ] `Feedback/Tooltip`
- [ ] `Feedback/Tour`
- [ ] `Form/Autocomplete`
- [ ] `Form/Cascader`
- [ ] `Form/Checkbox`
- [ ] `Form/CheckboxGroup`
- [ ] `Form/Form`
- [ ] `Form/FormItem`
- [ ] `Form/Input`
- [ ] `Form/InputNumber`
- [ ] `Form/InputOtp`
- [ ] `Form/InputTag`
- [ ] `Form/Mention`
- [ ] `Form/Radio`
- [ ] `Form/RadioGroup`
- [ ] `Form/Rate`
- [ ] `Form/Segmented`
- [ ] `Form/Select`
- [ ] `Form/Slider`
- [ ] `Form/Switch`
- [ ] `Form/Textarea`
- [ ] `Form/Upload`
- [ ] `Layout/Aside`
- [ ] `Layout/Container`
- [ ] `Layout/Flex`
- [ ] `Layout/Footer`
- [ ] `Layout/Grid`
- [ ] `Layout/GridItem`
- [ ] `Layout/Header`
- [ ] `Layout/Layout`
- [ ] `Layout/Main`
- [x] `Layout/Scrollbar`
- [ ] `Layout/Splitter`
- [ ] `Layout/Sticky`
- [ ] `Navigation/Anchor`
- [ ] `Navigation/BackTop`
- [ ] `Navigation/Breadcrumb`
- [ ] `Navigation/Dropdown`
- [ ] `Navigation/Menu`
- [ ] `Navigation/PageHeader`
- [ ] `Navigation/Steps`
- [ ] `Navigation/Tabs`
- [ ] `Picker/Calendar`
- [ ] `Picker/ColorPicker`
- [ ] `Picker/DatePicker`
- [ ] `Picker/TimePicker`
- [ ] `Providers/DefaultsProvider`
- [ ] `Providers/LocaleProvider`
- [ ] `Providers/ThemeProvider`

## 尚未在 ElfUI 中建目录的 Element Plus 组件

- 无

## 已由现有目录或样式体系承接的 Element Plus 文档

- `border.md` / `color.md`：属于 Element Plus 样式规范文档，先由全局 token、基础样式和后续文档承接，不新增运行时组件目录。
- `text.md` / `typography.md`：由 `Basic/Text` 先承接基础文本能力，后续再决定是否拆 Typography 组合组件。
- `popover.md`：由 `Feedback/Tooltip` 先承接浮层定位能力，后续按 API 差距决定是否拆 `Popover`。
- `table-v2.md` / `tree-v2.md` / `tree-select.md`：先挂在 `Data/Table`、`Data/Tree` 的对标计划里，后续按复杂度拆目录。

## 统一验收

- [ ] 所有对外组件 API 名称、默认值、事件 payload、slot/expose 能力对齐 Element Plus 文档。
- [ ] 所有组件页面示例支持 Template / Script 视图；动态绑定统一使用 `${...}`。
- [ ] 每个组件至少覆盖基础用法、受控状态、禁用/清空/空数据、键盘或可访问性核心路径。
- [ ] `pnpm verify` 通过；大范围变更前可先用 `npm --prefix ui-kit run build` 和目标测试分批验证。

## 2026-07-14 体验升级批次

- [x] 完成 Form / Upload / InfiniteScroll / Skeleton 案例布局修复。
- [x] 完成 Carousel / Timeline / Tree / Table / Loading 视觉升级。
- [x] 完成 Menu / Tabs / Steps 溢出、折叠和交互回归修复。
- [x] 完成 Calendar / DatePicker / TimePicker 的 Vuetify 信息架构参考升级，并通过定向测试、构建和真实浏览器暗色验收。
- [x] 完成 Splitter / InputTag / Image / Sticky 的真实交互修复，并补齐 Tour / InfiniteScroll / Picker 案例。
- [x] 完成 AvatarGroup 暗色外观、Tree 无边框默认值及 Flex / Grid / Container 响应式布局增强。
- [x] 本批 15 个目标测试文件共 108 条用例通过，生产构建及关键浏览器路径验收通过。
