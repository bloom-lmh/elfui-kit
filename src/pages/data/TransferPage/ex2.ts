import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const users = [
  { id: "u1", name: "张三" },
  { id: "u2", name: "李四" },
  { id: "u3", name: "王五" },
  { id: "u4", name: "赵六" },
  { id: "u5", name: "孙七" },
  { id: "u6", name: "周八" },
  { id: "u7", name: "吴九" },
  { id: "u8", name: "郑十" },
  { id: "u9", name: "冯十一" },
  { id: "u10", name: "陈十二" }
];

const selected1 = useRef<string[]>([]);

const selected2 = useRef<string[]>([]);

const onTransfer1 = (e: Event) => {
  const detail = (e as CustomEvent).detail;
  if (Array.isArray(detail)) selected1.set(detail);
};

const onTransfer2 = (e: Event) => {
  const detail = (e as CustomEvent).detail;
  if (Array.isArray(detail)) selected2.set(detail);
};

const code1 = `const users = [
  { id: "u1", name: "张三" },
  { id: "u2", name: "李四" },
  // ...
]
<elf-transfer
  :data="users"
  :modelValue="selected"
  @update:modelValue="onChange"
  :props="{ key: 'id', label: 'name' }"
  :titles="['可选用户', '已选用户']"
  filterable
/>`;

const code2 = `<elf-transfer
  :data="users"
  :modelValue="selected"
  @update:modelValue="onChange"
  :props="{ key: 'id', label: 'name' }"
  filterable
  filter-placeholder="搜索用户..."
/>`;

const PageTransferEx2 = defineHtml(html`
  <h2>自定义字段 + 可搜索</h2>
  <elf-playground title="自定义 key/label 映射 + 搜索过滤" :code="code1">
    <elf-transfer
      :data="users"
      :modelValue="selected1"
      @update:modelValue="onTransfer1"
      :props="{ key: 'id', label: 'name' }"
      :titles="['可选用户', '已选用户']"
      filterable
      filter-placeholder="搜索用户..."
    ></elf-transfer>
  </elf-playground>

  <h2>大量数据搜索</h2>
  <elf-playground title="输入关键词快速筛选" :code="code2">
    <elf-transfer
      :data="users"
      :modelValue="selected2"
      @update:modelValue="onTransfer2"
      :props="{ key: 'id', label: 'name' }"
      filterable
      filter-placeholder="请输入姓名..."
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx2 };
