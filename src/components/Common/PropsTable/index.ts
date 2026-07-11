// elf-props-table — 组件 prop / event / part 表格

import { defineProps, defineStyle, html, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { PropsTableProps, TableRow } from "./types";

export type { PropsTableProps, TableRow } from "./types";

const props = defineProps({
  title: { type: String, default: "Props" },
  rows: { type: Array, default: () => [] as TableRow[] }
}) as unknown as Readonly<PropsTableProps>;

defineStyle(styles);

const PropsTable = defineHtml(html`
  <div>
    <h4>${props.title}</h4>
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>类型</th>
          <th>默认值</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in props.rows" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td><code>{{ row.type || "-" }}</code></td>
          <td><code>{{ row.default || "-" }}</code></td>
          <td>{{ row.desc || "" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
`);

export { PropsTable };
