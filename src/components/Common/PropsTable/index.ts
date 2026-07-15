// elf-props-table — 组件 prop / event / part 表格

import { defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { PropsTableProps, PropsTableSlots, TableRow } from "./types";

export type { PropsTableProps, PropsTableSlots, TableCellValue, TableRow } from "./types";

const props = defineProps<PropsTableProps>({
  title: { type: String, default: "Props" },
  rows: { type: Array, default: () => [] as TableRow[] },
  emptyText: { type: String, default: "暂无数据" }
});

const rows = (): TableRow[] => Array.isArray(props.rows) ? props.rows : [];

defineStyle(styles);

const PropsTable = defineHtml<PropsTableProps, Record<string, never>, PropsTableSlots>(html`
  <div>
    <h4 part="title">${props.title}</h4>
    <div class="table-scroll">
      <table part="table" :aria-label=${props.title}>
        <thead part="header">
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody part="body">
          <tr v-for="row in rows()" :key="row.name" part="row">
            <td><code>{{ row.name }}</code></td>
            <td><code>{{ row.type ?? "-" }}</code></td>
            <td><code>{{ row.default ?? "-" }}</code></td>
            <td>{{ row.desc ?? "" }}</td>
          </tr>
          <tr v-if=${rows().length === 0} class="empty-row">
            <td colspan="4"><slot name="empty">${props.emptyText}</slot></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`);

export { PropsTable };
