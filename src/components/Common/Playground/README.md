# Playground 演示容器

文档站点常用的"演示 + 代码"组合容器。

## 用法

```html
<elf-playground title="基础按钮" code="<elf-button>OK</elf-button>">
  <elf-button>OK</elf-button>
</elf-playground>
```

## Props

| 名称    | 类型     | 默认值 | 说明                       |
| ------- | -------- | ------ | -------------------------- |
| `title` | `string` | `""`   | 标题（不传则不渲染头部）   |
| `code`  | `string` | `""`   | 源码字符串（不传则不渲染） |

## Events

| 名称   | 参数             | 说明           |
| ------ | ---------------- | -------------- |
| `copy` | `(code: string)` | 复制成功后触发 |

## Slots

默认 slot：渲染区
