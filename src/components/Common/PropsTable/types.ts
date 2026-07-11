// elf-props-table 类型

export interface TableRow {
  name: string;
  type?: string;
  default?: string;
  desc?: string;
}

export interface PropsTableProps {
  title: string;
  rows: TableRow[];
}
