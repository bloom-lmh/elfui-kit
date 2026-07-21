import { defineHtml, html, onMount, onUnmount, useHost } from "elfui";


const host = useHost();
let currentPage = 1;
let pageSize = 5;

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
  currentPage = Number(first(event, currentPage));
  applyPage();
};

const onSizeChange = (event: Event): void => {
  pageSize = Number(first(event, pageSize));
  applyPage();
};

const pagedData = (): Record<string, unknown>[] => {
  const start = (currentPage - 1) * pageSize;
  return orders.slice(start, start + pageSize);
};

const rangeText = (): string => {
  const start = Math.min(orders.length, (currentPage - 1) * pageSize + 1);
  const end = Math.min(orders.length, currentPage * pageSize);
  return `展示 ${start}-${end} / ${orders.length} 条`;
};

const applyPage = (): void => {
  const table = host.shadowRoot?.querySelector<HTMLElement & { data: Record<string, unknown>[] }>("elf-table");
  if (table) table.data = pagedData();
  const status = host.shadowRoot?.querySelector<HTMLElement>(".table-page-status");
  if (status) status.textContent = rangeText();
};

let paginationElement: HTMLElement | null = null;
onMount(() => {
  paginationElement = host.shadowRoot?.querySelector("elf-pagination") ?? null;
  paginationElement?.addEventListener("current-change", onPageChange);
  paginationElement?.addEventListener("size-change", onSizeChange);
});
onUnmount(() => {
  paginationElement?.removeEventListener("current-change", onPageChange);
  paginationElement?.removeEventListener("size-change", onSizeChange);
  paginationElement = null;
});

const code = `const pagedData = () => {
  const start = (currentPage.value - 1) * pageSize.value
  return orders.slice(start, start + pageSize.value)
}

<elf-table :data.prop="pagedData()" :columns.prop="columns" />
<elf-pagination
  :total.prop="orders.length"
  default-current-page="1"
  default-page-size="5"
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
        <span slot="status" class="demo-state table-page-status">${rangeText()}</span>
        <elf-pagination
          background
          :total.prop="orders.length"
          :defaultCurrentPage.prop="1"
          :defaultPageSize.prop="5"
          :pageSizes.prop="[5, 10, 20]"
        ></elf-pagination>
      </div>
    </div>
  </elf-playground>
`);

export { PageTableEx2 };
