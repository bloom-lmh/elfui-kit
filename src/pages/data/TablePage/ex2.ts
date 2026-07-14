import { defineHtml, html, useRef } from "elfui";


const currentPage = useRef(1);

const pageSize = useRef(5);

const columns = [
  { prop: "orderNo", label: "订单号", minWidth: 150 },
  { prop: "customer", label: "客户", minWidth: 120 },
  { prop: "amount", label: "金额", width: 110, align: "right", sortable: true },
  { prop: "state", label: "状态", width: 110 },
  { prop: "createdAt", label: "创建时间", width: 130 }
];

const states = ["待付款", "处理中", "已发货", "已完成"];

const orders = Array.from({ length: 37 }, (_, index) => {
  const no = index + 1;
  return {
    id: String(no),
    orderNo: `ELF-${String(2026000 + no)}`,
    customer: `客户 ${String.fromCharCode(65 + (index % 8))}`,
    amount: 128 + index * 17,
    state: states[index % states.length],
    createdAt: `06-${String((index % 18) + 1).padStart(2, "0")}`
  };
});

const first = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const onPageChange = (event: Event): void => {
  currentPage.set(Number(first(event, currentPage.value)));
};

const onSizeChange = (event: Event): void => {
  pageSize.set(Number(first(event, pageSize.value)));
};

const pagedData = (): Record<string, unknown>[] => {
  const start = (currentPage.value - 1) * pageSize.value;
  return orders.slice(start, start + pageSize.value);
};

const rangeText = (): string => {
  const start = Math.min(orders.length, (currentPage.value - 1) * pageSize.value + 1);
  const end = Math.min(orders.length, currentPage.value * pageSize.value);
  return `展示 ${start}-${end} / ${orders.length} 条`;
};

const code = `const pagedData = () => {
  const start = (currentPage.value - 1) * pageSize.value
  return orders.slice(start, start + pageSize.value)
}

<elf-table :data.prop="pagedData()" :columns.prop="columns" />
<elf-pagination
  :total.prop="orders.length"
  :currentPage.prop="currentPage"
  :pageSize.prop="pageSize"
  @current-change="onPageChange"
  @size-change="onSizeChange"
/>`;

const PageTableEx2 = defineHtml(html`
  <h2>分页联动</h2>
  <elf-playground title="Table 只负责当前页数据，Pagination 负责页码和页大小" :code="code">
    <div style="width: 100%; display: grid; gap: 14px">
      <elf-table :data.prop="pagedData()" :columns.prop="columns" border hover></elf-table>
      <div
        style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap"
      >
        <span slot="status" class="demo-state">{{ rangeText() }}</span>
        <elf-pagination
          background
          :total.prop="orders.length"
          :currentPage.prop="currentPage"
          :pageSize.prop="pageSize"
          :pageSizes.prop="[5, 10, 20]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        ></elf-pagination>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx2 };
