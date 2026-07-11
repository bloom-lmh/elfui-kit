export type TableColumnType = "default" | "selection" | "index" | "expand" | "actions";
export type TableAlign = "left" | "center" | "right";
export type TableSortOrder = "" | "ascending" | "descending";
export type TableSize = "small" | "default" | "large";

export type TableCellClass =
  | string
  | ((row: Record<string, unknown>, column: TableColumn, index: number) => string);

export type TableCellStyle =
  | Record<string, string | number>
  | ((
      row: Record<string, unknown>,
      column: TableColumn,
      index: number
    ) => Record<string, string | number>);

export interface TableAction {
  label: string;
  type?: "primary" | "danger" | "default";
  disabled?: boolean | ((row: Record<string, unknown>, index: number) => boolean);
  onClick?: (row: Record<string, unknown>, index: number, action: TableAction) => void;
}

export interface TableColumn {
  prop?: string;
  label?: string;
  type?: TableColumnType;
  width?: string | number;
  minWidth?: string | number;
  align?: TableAlign;
  fixed?: "left" | "right";
  sortable?: boolean;
  formatter?: (row: Record<string, unknown>, column: TableColumn, index: number) => unknown;
  className?: string;
  headerClassName?: string;
  cellClassName?: TableCellClass;
  cellStyle?: TableCellStyle;
  actions?: TableAction[];
  [key: string]: unknown;
}

export type TableExpandFormatter = (row: Record<string, unknown>, index: number) => unknown;

export interface TableProps {
  data: Record<string, unknown>[];
  columns: TableColumn[];
  rowKey: string;
  stripe: boolean;
  border: boolean;
  hover: boolean;
  size: TableSize;
  height: string;
  maxHeight: string;
  emptyText: string;
  loading: boolean;
  showHeader: boolean;
  stickyHeader: boolean;
  highlightCurrentRow: boolean;
  currentRowKey: string;
  selectedKeys: string[];
  defaultSelectedKeys: string[];
  expandedRowKeys: string[];
  defaultExpandedRowKeys: string[];
  expandFormatter?: TableExpandFormatter;
  sortProp: string;
  sortOrder: TableSortOrder;
}
