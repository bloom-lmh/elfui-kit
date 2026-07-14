import { defineHtml, html, useRef } from "elfui";


const selectedKeys = useRef<string[]>(["2"]);

const selectedRows = useRef<Record<string, unknown>[]>([]);

const currentRow = useRef("暂无");

const columns = [
  { type: "selection", width: 48, align: "center" },
  { type: "index", label: "#", width: 56, align: "center" },
  { prop: "name", label: "项目", minWidth: 160, sortable: true },
  { prop: "owner", label: "负责人", width: 120 },
  { prop: "progress", label: "进度", width: 110, align: "right", sortable: true },
  { prop: "status", label: "状态", width: 120 }
];

const data = [
  { id: "1", name: "组件规范整理", owner: "林舟", progress: 72, status: "进行中" },
  { id: "2", name: "表单校验补齐", owner: "周然", progress: 94, status: "已完成" },
  { id: "3", name: "主题变量审计", owner: "许宁", progress: 48, status: "进行中" },
  { id: "4", name: "文档示例回归", owner: "陈立", progress: 61, status: "待验收" }
];

const first = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const onSelectedKeys = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) selectedKeys.set(detail);
};

const onSelectionChange = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) selectedRows.set(detail);
};

const onRowClick = (event: Event): void => {
  const row = first<Record<string, unknown> | null>(event, null);
  currentRow.set(row ? String(row.name) : "暂无");
};

const selectedText = (): string =>
  data
    .filter((row) => selectedKeys.value.includes(row.id))
    .map((row) => row.name)
    .join("、") || "暂无";

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  :selectedKeys.prop="selectedKeys"
  stripe
  border
  highlight-current-row
  @update:selectedKeys="onSelectedKeys"
  @selection-change="onSelectionChange"
  @row-click="onRowClick"
/>`;

const PageTableEx1 = defineHtml(html`
  <h2>基础用法</h2>
  <elf-playground title="选择、排序和当前行高亮" :code="code">
    <div style="width: 100%; display: grid; gap: 12px">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        :selectedKeys.prop="selectedKeys"
        stripe
        border
        highlight-current-row
        @update:selectedKeys="onSelectedKeys"
        @selection-change="onSelectionChange"
        @row-click="onRowClick"
      ></elf-table>
      <p slot="status" class="demo-state">已选：{{ selectedText() }}；当前行：{{ currentRow }}</p>
    </div>
  </elf-playground>
`);

export { PageTableEx1 };
