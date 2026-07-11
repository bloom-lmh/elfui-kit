# Upload Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Upload`
- Element Plus 文档：`upload.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### upload.md

#### API

- `action ^`
- `headers`
- `multiple`
- `data`
- `with-credentials`
- `show-file-list`
- `drag`
- `accept`
- `crossorigin`
- `on-preview`
- `on-remove`
- `on-success`
- `on-error`
- `on-progress`
- `on-change`
- `on-exceed`
- `before-upload`
- `before-remove`
- `file-list / v-model:file-list`
- `list-type`
- `auto-upload`
- `http-request`
- `disabled`
- `limit`
- `directory ^`
- `default`
- `trigger`
- `tip`
- `file`
- `abort`
- `submit`
- `clearFiles`
- `handleStart`
- `handleRemove`

#### Attributes

- `action ^`
- `headers`
- `multiple`
- `data`
- `with-credentials`
- `show-file-list`
- `drag`
- `accept`
- `crossorigin`
- `on-preview`
- `on-remove`
- `on-success`
- `on-error`
- `on-progress`
- `on-change`
- `on-exceed`
- `before-upload`
- `before-remove`
- `file-list / v-model:file-list`
- `list-type`
- `auto-upload`
- `http-request`
- `disabled`
- `limit`
- `directory ^`

#### Slots

- `default`
- `trigger`
- `tip`
- `file`

#### Exposes

- `abort`
- `submit`
- `clearFiles`
- `handleStart`
- `handleRemove`

## 当前 ElfUI API 快照

### Props

- `accept`
- `action`
- `autoUpload`
- `beforeRemove`
- `beforeUpload`
- `buttonText`
- `chunkRequest`
- `chunkSize`
- `crossorigin`
- `data`
- `customRequest`
- `disabled`
- `directory`
- `drag`
- `fileNamePattern`
- `headers`
- `httpRequest`
- `limit`
- `listType`
- `method`
- `maxSize`
- `modelValue`
- `multiple`
- `name`
- `onChange`
- `onError`
- `onExceed`
- `onPreview`
- `onProgress`
- `onRemove`
- `onSuccess`
- `showFileList`
- `tip`
- `withCredentials`

### Events

- `change`
- `error`
- `exceed`
- `invalid`
- `preview`
- `progress`
- `remove`
- `success`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- `abort`
- `clearFiles`
- `handleRemove`
- `handleStart`
- `select`
- `submit`

## 本轮已完成（2026-07-05）

- [x] 补齐 `headers`、`data`、`method`、`with-credentials`、`crossorigin`、`directory`、`http-request` 基础能力。
- [x] 补齐 Element Plus 风格 callback props：`on-preview`、`on-remove`、`on-success`、`on-error`、`on-progress`、`on-change`、`on-exceed`。
- [x] 补齐 exposes：`abort`、`handleStart`、`handleRemove`、`clearFiles(statuses)`，保留 `select`、`submit`。
- [x] 文件列表模板核心动态绑定迁移为 `${...}`，文件 action 改为事件代理。
- [x] 补充 `httpRequest` 参数、`directory`、暴露方法和 `abort` 单测。

## 差距与任务

- [ ] P0 补齐核心属性差距：`file-list / v-model:file-list` 命名别名、真实 XHR 默认请求、directory 浏览器兼容提示和更完整的图片缩略图。
- [ ] P0 补齐事件差距：当前粗扫未发现明显缺口，进入实现时复核事件 payload 与触发时机。
- [ ] P1 补齐插槽/暴露方法：`trigger`、`tip`、`file` 的 scoped slot 数据结构，继续核对 `abort` 对真实请求的取消能力。
- [ ] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [ ] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [ ] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [ ] API props/types 与页面 PropsTable 同步。
- [ ] 关键交互和边界状态有单测覆盖。
- [ ] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [ ] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。
