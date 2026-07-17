import { defineHtml, html } from "elfui";
import type { TableColumn, TableRow } from "../../../components/Data/Table";

const data: TableRow[] = Array.from({ length: 10000 }, (_, index) => ({ id: index + 1, task: `流水线任务 #${String(index + 1).padStart(5, "0")}`, owner: ["林舒", "许宁", "周然"][index % 3], duration: `${18 + (index % 73)}s`, status: index % 4 === 0 ? "运行中" : "已完成" }));
const columns: TableColumn[] = [
  { type: "index", width: 72 },
  { prop: "task", label: "任务", minWidth: 220 },
  { prop: "owner", label: "负责人", width: 110 },
  { prop: "duration", label: "耗时", width: 90 },
  { prop: "status", label: "状态", width: 100 }
];
const PageTableEx21 = defineHtml(html`
  <h2>大数据虚拟滚动</h2>
  <elf-playground title="10,000 行流水线记录">
    <span slot="status" class="demo-state">10,000 行 · 固定 44px 行高 · 窗口化渲染</span>
    <div style="width:100%;max-width:850px">
      <elf-table :data.prop=${data} :columns.prop=${columns} height="396" row-height="44" overscan="6" virtual border stripe></elf-table>
    </div>
  </elf-playground>
`);
export { PageTableEx21 };
