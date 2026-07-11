# PropsTable 组件文档表

展示组件 props / events / parts 的表格。

## 用法

```html
<elf-props-table title="Props" .rows="propsList"></elf-props-table>
```

## Props

| 名称    | 类型         | 默认值    | 说明     |
| ------- | ------------ | --------- | -------- |
| `title` | `string`     | `"Props"` | 表头标题 |
| `rows`  | `TableRow[]` | `[]`      | 行数据   |

```ts
interface TableRow {
  name: string;
  type?: string;
  default?: string;
  desc?: string;
}
```
