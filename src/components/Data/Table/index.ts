// elf-table - data table with selection, sorting and pagination-friendly events

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  useHost,
  useRef,
  useTemplateRef,
  watchEffect,
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type {
  TableCellContext,
  TableColumn,
  TableHeaderCellContext,
  TableProps,
  TableRow,
  TableScrollDetail,
  TableStyle
} from "./types";

export type {
  TableAlign,
  TableColumn,
  TableColumnType,
  TableDefaultSort,
  TableExpose,
  TableLayout,
  TableProps,
  TableRow,
  TableRowKey,
  TableScrollDetail,
  TableSize,
  TableSummaryContext,
  TableSummaryMethod,
  TableSortOrder
} from "./types";

const SIGNATURE_SEP = "::elf-table::";

const props = defineProps<TableProps>({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  rowKey: { type: [String, Function], default: "id" },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  hover: { type: Boolean, default: true },
  size: { type: String, default: "default" },
  height: { type: [String, Number], default: "" },
  maxHeight: { type: [String, Number], default: "" },
  fit: { type: Boolean, default: true },
  tableLayout: { type: String, default: "fixed" },
  scrollbarAlwaysOn: { type: Boolean, default: false },
  emptyText: { type: String, default: "暂无数据" },
  loading: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: true },
  stickyHeader: { type: Boolean, default: true },
  highlightCurrentRow: { type: Boolean, default: false },
  currentRowKey: { type: [String, Number], default: "" },
  rowClassName: { type: [String, Function] },
  rowStyle: { type: [Object, Function] },
  cellClassName: { type: [String, Function] },
  cellStyle: { type: [Object, Function] },
  headerRowClassName: { type: [String, Function] },
  headerRowStyle: { type: [Object, Function] },
  headerCellClassName: { type: [String, Function] },
  headerCellStyle: { type: [Object, Function] },
  selectedKeys: { type: Array },
  defaultSelectedKeys: { type: Array, default: () => [] },
  selectOnIndeterminate: { type: Boolean, default: true },
  expandedRowKeys: { type: Array },
  defaultExpandedRowKeys: { type: Array, default: () => [] },
  defaultExpandAll: { type: Boolean, default: false },
  expandFormatter: { type: Function },
  sortProp: { type: String, default: "" },
  sortOrder: { type: String, default: "" },
  defaultSort: { type: Object },
  showOverflowTooltip: { type: Boolean, default: false },
  showSummary: { type: Boolean, default: false },
  sumText: { type: String, default: "合计" },
  summaryMethod: { type: Function }
});

const emit = defineEmits([
  "update:selectedKeys",
  "update:expandedRowKeys",
  "select",
  "select-all",
  "selection-change",
  "current-change",
  "cell-mouse-enter",
  "cell-mouse-leave",
  "cell-click",
  "cell-dblclick",
  "cell-contextmenu",
  "row-click",
  "row-contextmenu",
  "row-dblclick",
  "header-click",
  "header-contextmenu",
  "expand-change",
  "action-click",
  "sort-change",
  "scroll"
]);

// Template references
const host = useHost();
const wrapRef = useTemplateRef<HTMLElement>("wrap");

const columnsState = useRef<TableColumnView[]>([]);

const rowsState = useRef<TableRowView[]>([]);

const selectedState = useRef<string[]>([]);

const expandedState = useRef<string[]>([]);

const currentKey = useRef("");

const sortPropState = useRef("");

const sortOrderState = useRef<SortOrder>("");

const lastSelectedSig = useRef("");

const lastExpandedSig = useRef("");

let initialized = false;
let initialExpansionApplied = false;

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

const signature = (keys: string[]): string => keys.join(SIGNATURE_SEP);

const cssSize = (value: unknown): string => {
  if (value == null || value === "") return "";
  return typeof value === "number" ? `${value}px` : String(value);
};

const cssSizeNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const columnSize = (column: TableColumnView): number =>
  cssSizeNumber(column.width || column.minWidth || "120px") || 120;

const columnWidth = (column: TableColumnView): string => `${columnSize(column)}px`;

const valueAtPath = (row: TableRow, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as TableRow)[key];
  }, row);

const rowKeyOf = (row: TableRow, index: number): string => {
  const key = props.rowKey;
  if (typeof key === "function") {
    try {
      return String(key(row));
    } catch {
      return String(index);
    }
  }
  return String(valueAtPath(row, String(key || "id")) ?? index);
};

const rawColumns = (): Record<string, unknown>[] =>
  Array.isArray(props.columns) ? (props.columns as Record<string, unknown>[]) : [];

const rawRows = (): TableRow[] => (Array.isArray(props.data) ? (props.data as TableRow[]) : []);

const normalizeColumns = (): TableColumnView[] => {
  const source = rawColumns();
  if (source.length === 0) {
    const first = rawRows()[0] || {};
    return Object.keys(first).map((key) => ({
      id: key,
      prop: key,
      label: key,
      type: "default",
      width: "",
      minWidth: "120px",
      align: "left",
      headerAlign: "left",
      sortable: false,
      fixed: "",
      fixedOffset: "",
      fixedLast: false,
      raw: { prop: key, label: key }
    }));
  }

  const columns: TableColumnView[] = source.map((column, index) => {
    const type = String(column.type || "default") as TableColumnView["type"];
    const prop = String(column.prop || (type === "default" ? `column_${index}` : type));
    const normalizedType: TableColumnView["type"] =
      type === "selection" || type === "index" || type === "expand" || type === "actions"
        ? type
        : "default";
    return {
      id: String(column.id || prop || index),
      prop,
      label: String(
        column.label ||
          (type === "selection" || type === "expand"
            ? ""
            : type === "index"
              ? "#"
              : type === "actions"
                ? "操作"
                : prop)
      ),
      type: normalizedType,
      width: cssSize(column.width),
      minWidth: cssSize(
        column.minWidth ||
          (type === "selection" || type === "expand"
            ? 48
            : type === "index"
              ? 64
              : type === "actions"
                ? 140
                : 120)
      ),
      align: column.align === "center" || column.align === "right" ? column.align : "left",
      headerAlign:
        column.headerAlign === "center" || column.headerAlign === "right"
          ? column.headerAlign
          : column.align === "center" || column.align === "right"
            ? column.align
            : "left",
      sortable: Boolean(column.sortable),
      fixed: column.fixed === "left" || column.fixed === "right" ? column.fixed : "",
      fixedOffset: "",
      fixedLast: false,
      raw: column
    };
  });
  let left = 0;
  for (const column of columns) {
    if (column.fixed !== "left") continue;
    column.fixedOffset = `${left}px`;
    left += columnSize(column);
  }
  let right = 0;
  for (const column of [...columns].reverse()) {
    if (column.fixed !== "right") continue;
    column.fixedOffset = `${right}px`;
    right += columnSize(column);
  }
  const leftFixed = columns.filter((column) => column.fixed === "left");
  const rightFixed = columns.filter((column) => column.fixed === "right");
  if (leftFixed.length > 0) leftFixed[leftFixed.length - 1]!.fixedLast = true;
  if (rightFixed.length > 0) rightFixed[0]!.fixedLast = true;
  return columns;
};

const compareValue = (a: unknown, b: unknown): number => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "zh-Hans-CN", { numeric: true });
};

const sortedData = (): Record<string, unknown>[] => {
  const data = [...rawRows()];
  const prop = sortPropState.value;
  const order = sortOrderState.value;
  if (!prop || !order) return data;
  const direction = order === "ascending" ? 1 : -1;
  return data.sort((a, b) => compareValue(a[prop], b[prop]) * direction);
};

const rebuildRows = (): void => {
  const columns = normalizeColumns();
  const rows = sortedData().map((row, index) => ({
    key: rowKeyOf(row, index),
    index,
    raw: row
  }));

  columnsState.set(columns);
  rowsState.set(rows);

  const rowKeys = new Set(rows.map((row) => row.key));
  const nextSelected = selectedState.peek().filter((key) => rowKeys.has(key));
  if (signature(nextSelected) !== lastSelectedSig.peek()) {
    selectedState.set(nextSelected);
    lastSelectedSig.set(signature(nextSelected));
  }
  const nextExpanded = expandedState.peek().filter((key) => rowKeys.has(key));
  if (signature(nextExpanded) !== lastExpandedSig.peek()) {
    expandedState.set(nextExpanded);
    lastExpandedSig.set(signature(nextExpanded));
  }
  if (currentKey.peek() && !rowKeys.has(currentKey.peek())) currentKey.set("");
};

const setSelectedKeys = (keys: string[], shouldEmit = true): void => {
  const rowKeys = new Set(rowsState.peek().map((row) => row.key));
  const next = Array.from(new Set(keys.map(String).filter((key) => rowKeys.has(key))));
  selectedState.set(next);
  lastSelectedSig.set(signature(next));
  if (shouldEmit) {
    emit("update:selectedKeys", next);
    emit("selection-change", getSelectionRows());
  }
};

const setExpandedKeys = (keys: string[], shouldEmit = true, row?: TableRowView): void => {
  const rowKeys = new Set(rowsState.peek().map((item) => item.key));
  const next = Array.from(new Set(keys.map(String).filter((key) => rowKeys.has(key))));
  expandedState.set(next);
  lastExpandedSig.set(signature(next));
  if (shouldEmit) {
    emit("update:expandedRowKeys", next);
    emit("expand-change", row?.raw, next);
  }
};

watchEffect(() => {
  if (!initialized) {
    initialized = true;
    selectedState.set(
      normalizeKeys(
        Array.isArray(props.selectedKeys) ? props.selectedKeys : props.defaultSelectedKeys
      )
    );
    expandedState.set(
      normalizeKeys(
        Array.isArray(props.expandedRowKeys) ? props.expandedRowKeys : props.defaultExpandedRowKeys
      )
    );
    currentKey.set(String(props.currentRowKey || ""));
    const defaultSort = (props.defaultSort || {}) as TableDefaultSort;
    sortPropState.set(String(props.sortProp || defaultSort.prop || ""));
    sortOrderState.set(
      (String(props.sortOrder || defaultSort.order || "") as SortOrder) || ""
    );
  }
  rebuildRows();
  if (!initialExpansionApplied) {
    initialExpansionApplied = true;
    if (
      props.defaultExpandAll &&
      !Array.isArray(props.expandedRowKeys) &&
      normalizeKeys(props.defaultExpandedRowKeys).length === 0
    ) {
      setExpandedKeys(
        rowsState.peek().map((row) => row.key),
        false
      );
    }
  }
});

watchEffect(() => {
  if (!Array.isArray(props.expandedRowKeys)) return;
  const next = normalizeKeys(props.expandedRowKeys);
  if (signature(next) === lastExpandedSig.peek()) return;
  setExpandedKeys(next, false);
});

watchEffect(() => {
  if (!Array.isArray(props.selectedKeys)) return;
  const next = normalizeKeys(props.selectedKeys);
  if (signature(next) === lastSelectedSig.peek()) return;
  setSelectedKeys(next, false);
});

watchEffect(() => {
  const next = String(props.currentRowKey || "");
  if (next !== currentKey.peek()) currentKey.set(next);
});

watchEffect(() => {
  const nextProp = String(props.sortProp || "");
  const nextOrder = String(props.sortOrder || "") as SortOrder;
  if (nextProp !== sortPropState.peek() || nextOrder !== sortOrderState.peek()) {
    sortPropState.set(nextProp);
    sortOrderState.set(nextOrder === "ascending" || nextOrder === "descending" ? nextOrder : "");
    rebuildRows();
  }
});

const getColumns = (): TableColumnView[] => columnsState.value;

const getRows = (): TableRowView[] => rowsState.value;

const tableClass = (): Record<string, boolean> => ({
  "is-stripe": Boolean(props.stripe),
  "is-border": Boolean(props.border),
  "is-hover": Boolean(props.hover),
  "is-small": props.size === "small",
  "is-large": props.size === "large",
  "is-sticky-header": Boolean(props.stickyHeader),
  "is-fit": Boolean(props.fit),
  "is-scrollbar-always": Boolean(props.scrollbarAlwaysOn)
});

const wrapStyle = (): Record<string, string> => {
  const style: Record<string, string> = {};
  if (props.height) style.height = cssSize(props.height);
  if (props.maxHeight) style.maxHeight = cssSize(props.maxHeight);
  return style;
};

const tableStyle = (): Record<string, string> => {
  const totalWidth = getColumns().reduce((sum, column) => sum + columnSize(column), 0);
  const style: Record<string, string> = { tableLayout: String(props.tableLayout || "fixed") };
  if (totalWidth <= 0) return style;
  style.minWidth = `${totalWidth}px`;
  if (!props.fit) style.width = `${totalWidth}px`;
  return style;
};

const colStyle = (column: TableColumnView): Record<string, string> => {
  const width = columnWidth(column);
  return { width, minWidth: width, maxWidth: width };
};

const columnBoxStyle = (column: TableColumnView): Record<string, string> => {
  const width = columnWidth(column);
  return { width, minWidth: width, maxWidth: width };
};

const baseCellClass = (
  column: TableColumnView,
  align: TableColumnView["align"] = column.align
): Record<string, boolean> => ({
  "is-center": align === "center",
  "is-right": align === "right",
  "is-selection": column.type === "selection",
  "is-index": column.type === "index",
  "is-expand": column.type === "expand",
  "is-actions": column.type === "actions",
  "is-sortable": column.sortable,
  "is-fixed-left": column.fixed === "left",
  "is-fixed-right": column.fixed === "right",
  "is-fixed-last": column.fixedLast
});

const columnIndexOf = (column: TableColumnView): number => getColumns().indexOf(column);

const resolveColumnClass = (
  value: unknown,
  row: TableRowView | null,
  column: TableColumnView
): string => {
  if (typeof value === "function" && row) {
    try {
      return String(value(row.raw, column.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveRowClass = (row: TableRowView): string => {
  const value = props.rowClassName;
  if (typeof value === "function") {
    try {
      return String(value({ row: row.raw, rowIndex: row.index }) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveRowStyle = (row: TableRowView): TableStyle => {
  const value = props.rowStyle;
  if (typeof value === "function") {
    try {
      return value({ row: row.raw, rowIndex: row.index }) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const cellContext = (column: TableColumnView, row: TableRowView): TableCellContext => ({
  row: row.raw,
  rowIndex: row.index,
  column: column.raw as TableColumn,
  columnIndex: columnIndexOf(column)
});

const resolveGlobalCellClass = (column: TableColumnView, row: TableRowView): string => {
  const value = props.cellClassName;
  if (typeof value === "function") {
    try {
      return String(value(cellContext(column, row)) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveGlobalCellStyle = (column: TableColumnView, row: TableRowView): TableStyle => {
  const value = props.cellStyle;
  if (typeof value === "function") {
    try {
      return value(cellContext(column, row)) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const headerContext = (column: TableColumnView): TableHeaderCellContext => ({
  rowIndex: 0,
  column: column.raw as TableColumn,
  columnIndex: columnIndexOf(column)
});

const resolveHeaderCellClass = (column: TableColumnView): string => {
  const value = props.headerCellClassName;
  if (typeof value === "function") {
    try {
      return String(value(headerContext(column)) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const resolveHeaderCellStyle = (column: TableColumnView): TableStyle => {
  const value = props.headerCellStyle;
  if (typeof value === "function") {
    try {
      return value(headerContext(column)) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const headerCellClass = (column: TableColumnView): ClassValue => [
  baseCellClass(column, column.headerAlign),
  resolveColumnClass(column.raw.headerClassName || column.raw.className, null, column),
  resolveHeaderCellClass(column)
];

const cellClass = (column: TableColumnView, row: TableRowView): ClassValue => [
  baseCellClass(column),
  resolveColumnClass(column.raw.className, row, column),
  resolveColumnClass(column.raw.cellClassName, row, column),
  resolveGlobalCellClass(column, row)
];

const cellStyle = (column: TableColumnView, row: TableRowView): StyleValue => {
  const raw = column.raw.cellStyle;
  if (typeof raw === "function") {
    try {
      return (raw(row.raw, column.raw, row.index) || {}) as StyleValue;
    } catch {
      return {};
    }
  }
  if (raw && typeof raw === "object") return raw as StyleValue;
  return {};
};

const fixedStyle = (column: TableColumnView): Record<string, string> => {
  if (!column.fixed) return {};
  return { [column.fixed]: column.fixedOffset || "0px" };
};

const headerCellStyle = (column: TableColumnView): StyleValue => ({
  ...columnBoxStyle(column),
  ...fixedStyle(column),
  ...resolveHeaderCellStyle(column)
});

const mergedCellStyle = (column: TableColumnView, row: TableRowView): StyleValue => ({
  ...columnBoxStyle(column),
  ...fixedStyle(column),
  ...resolveGlobalCellStyle(column, row),
  ...(cellStyle(column, row) as Record<string, string | number>)
});

const rowClass = (row: TableRowView): ClassValue => [
  {
    "is-current": Boolean(props.highlightCurrentRow && currentKey.value === row.key),
    "is-selected": selectedState.value.includes(row.key)
  },
  resolveRowClass(row)
];

const rowStyle = (row: TableRowView): StyleValue => resolveRowStyle(row);

const headerRowClass = (): string => {
  const value = props.headerRowClassName;
  if (typeof value === "function") {
    try {
      return String(value({ rowIndex: 0 }) ?? "");
    } catch {
      return "";
    }
  }
  return typeof value === "string" ? value : "";
};

const headerRowStyle = (): StyleValue => {
  const value = props.headerRowStyle;
  if (typeof value === "function") {
    try {
      return value({ rowIndex: 0 }) || {};
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as TableStyle) : {};
};

const getCell = (row: TableRowView, column: TableColumnView): string => {
  if (column.type === "index") {
    const index = column.raw.index;
    if (typeof index === "function") {
      try {
        return String(index(row.index));
      } catch {
        return String(row.index + 1);
      }
    }
    return String(typeof index === "number" ? index + row.index : row.index + 1);
  }
  if (column.type === "selection") return "";
  if (column.type === "expand") return "";
  if (column.type === "actions") return "";
  const formatter = column.raw.formatter;
  if (typeof formatter === "function") {
    try {
      return String(formatter(row.raw, column.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  return String(row.raw[column.prop] ?? "");
};

const cellTitle = (row: TableRowView, column: TableColumnView): string => {
  if (!(column.raw.showOverflowTooltip ?? props.showOverflowTooltip)) return "";
  const formatter = column.raw.tooltipFormatter;
  if (typeof formatter === "function") {
    try {
      return String(formatter(row.raw, column.raw, row.index) ?? "");
    } catch {
      return getCell(row, column);
    }
  }
  return getCell(row, column);
};

const isSelected = (row: TableRowView): boolean => selectedState.value.includes(row.key);

const isExpanded = (row: TableRowView): boolean => expandedState.value.includes(row.key);

const selectionColumn = (): TableColumnView | undefined =>
  columnsState.value.find((column) => column.type === "selection");

const isSelectable = (row: TableRowView): boolean => {
  const selectable = selectionColumn()?.raw.selectable;
  if (typeof selectable !== "function") return true;
  try {
    return Boolean(selectable(row.raw, row.index));
  } catch {
    return true;
  }
};

const selectableRows = (): TableRowView[] => rowsState.value.filter(isSelectable);

const isAllSelected = (): boolean => {
  const rows = selectableRows();
  return rows.length > 0 && rows.every((row) => selectedState.value.includes(row.key));
};

const isIndeterminate = (): boolean => {
  const rows = selectableRows();
  const count = rows.filter((row) => selectedState.value.includes(row.key)).length;
  return count > 0 && count < rows.length;
};

const toggleRowSelection = (target: unknown, selected?: boolean, ignoreSelectable = false): void => {
  const rows = rowsState.peek();
  const row =
    typeof target === "string" || typeof target === "number"
      ? rows.find((item) => item.key === String(target))
      : rows.find((item) => item.raw === target);
  if (!row) return;
  if (!ignoreSelectable && !isSelectable(row)) return;
  const set = new Set(selectedState.peek());
  const shouldSelect = selected == null ? !set.has(row.key) : selected;
  if (shouldSelect) set.add(row.key);
  else set.delete(row.key);
  setSelectedKeys(Array.from(set), true);
};

const toggleAllSelection = (): void => {
  const shouldClear = isAllSelected() || (isIndeterminate() && !props.selectOnIndeterminate);
  const disabledKeys = selectedState.peek().filter((key) => {
    const row = rowsState.peek().find((item) => item.key === key);
    return row ? !isSelectable(row) : false;
  });
  setSelectedKeys(
    shouldClear ? disabledKeys : [...disabledKeys, ...selectableRows().map((row) => row.key)],
    true
  );
};

const onToggleRowSelection = (row: TableRowView): void => {
  toggleRowSelection(row.key);
  emit("select", getSelectionRows(), row.raw);
};

const onToggleAllSelection = (): void => {
  toggleAllSelection();
  emit("select-all", getSelectionRows());
};

const clearSelection = (): void => setSelectedKeys([], true);

const resolveRow = (target: unknown): TableRowView | undefined => {
  const rows = rowsState.peek();
  if (typeof target === "string" || typeof target === "number") {
    return rows.find((item) => item.key === String(target));
  }
  if (target && typeof target === "object" && "key" in target && "raw" in target) {
    return target as TableRowView;
  }
  return rows.find((item) => item.raw === target);
};

const toggleRowExpansion = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (!row) return;
  const set = new Set(expandedState.peek());
  const shouldExpand = expanded == null ? !set.has(row.key) : expanded;
  if (shouldExpand) set.add(row.key);
  else set.delete(row.key);
  setExpandedKeys(Array.from(set), true, row);
};

function getSelectionRows(): Record<string, unknown>[] {
  const selected = new Set(selectedState.peek());
  return rowsState
    .peek()
    .filter((row) => selected.has(row.key))
    .map((row) => row.raw);
}

const setCurrentRow = (target: unknown): void => {
  const rows = rowsState.peek();
  const row =
    typeof target === "string" || typeof target === "number"
      ? rows.find((item) => item.key === String(target))
      : rows.find((item) => item.raw === target);
  if (!row) return;
  const old = currentKey.peek();
  currentKey.set(row.key);
  emit("current-change", row.raw, old ? rows.find((item) => item.key === old)?.raw : undefined);
};

const columnFromEvent = (event: Event): TableColumnView | undefined => {
  const cell = (event.target as Element | null)?.closest<HTMLElement>("[data-column-index]");
  const index = Number(cell?.dataset.columnIndex);
  return Number.isInteger(index) ? getColumns()[index] : undefined;
};

const onRowClick = (row: TableRowView, event: MouseEvent): void => {
  setCurrentRow(row.key);
  emit("row-click", row.raw, columnFromEvent(event)?.raw, event);
};

const onRowDblClick = (row: TableRowView, event: MouseEvent): void =>
  emit("row-dblclick", row.raw, columnFromEvent(event)?.raw, event);

const onRowContextMenu = (row: TableRowView, event: MouseEvent): void =>
  emit("row-contextmenu", row.raw, columnFromEvent(event)?.raw, event);

const onCellMouseEnter = (
  row: TableRowView,
  column: TableColumnView,
  event: MouseEvent
): void => emit("cell-mouse-enter", row.raw, column.raw, event.currentTarget, event);

const onCellMouseLeave = (
  row: TableRowView,
  column: TableColumnView,
  event: MouseEvent
): void => emit("cell-mouse-leave", row.raw, column.raw, event.currentTarget, event);

const onCellClick = (row: TableRowView, column: TableColumnView, event: MouseEvent): void =>
  emit("cell-click", row.raw, column.raw, event.currentTarget, event);

const onCellDblClick = (row: TableRowView, column: TableColumnView, event: MouseEvent): void =>
  emit("cell-dblclick", row.raw, column.raw, event.currentTarget, event);

const onCellContextMenu = (
  row: TableRowView,
  column: TableColumnView,
  event: MouseEvent
): void => emit("cell-contextmenu", row.raw, column.raw, event.currentTarget, event);

const onHeaderClick = (column: TableColumnView, event: MouseEvent): void =>
  emit("header-click", column.raw, event);

const onHeaderContextMenu = (column: TableColumnView, event: MouseEvent): void =>
  emit("header-contextmenu", column.raw, event);

const getExpandContent = (row: TableRowView): string => {
  if (typeof props.expandFormatter === "function") {
    try {
      return String(props.expandFormatter(row.raw, row.index) ?? "");
    } catch {
      return "";
    }
  }
  const entries = Object.entries(row.raw).map(([key, value]) => `${key}: ${String(value ?? "")}`);
  return entries.join("    ");
};

const actionType = (value: unknown): TableActionView["type"] =>
  value === "primary" || value === "danger" ? value : "default";

const getActions = (row: TableRowView, column: TableColumnView): TableActionView[] => {
  const actions = Array.isArray(column.raw.actions) ? column.raw.actions : [];
  return actions.map((action) => {
    const raw = action as Record<string, unknown>;
    let disabled = Boolean(raw.disabled);
    if (typeof raw.disabled === "function") {
      try {
        disabled = Boolean(raw.disabled(row.raw, row.index));
      } catch {
        disabled = false;
      }
    }
    return {
      label: String(raw.label || ""),
      type: actionType(raw.type),
      disabled,
      raw
    };
  });
};

const actionClass = (action: TableActionView): Record<string, boolean> => ({
  "is-primary": action.type === "primary",
  "is-danger": action.type === "danger"
});

const invokeAction = (action: TableActionView, row: TableRowView): void => {
  if (action.disabled) return;
  const handler = action.raw.onClick;
  if (typeof handler === "function") handler(row.raw, row.index, action.raw);
  emit("action-click", action.raw, row.raw, row.index);
};

const sort = (prop: string, order: SortOrder = "ascending"): void => {
  sortPropState.set(prop);
  sortOrderState.set(order);
  rebuildRows();
  emit("sort-change", { prop, order });
};

const clearSort = (): void => sort("", "");

const toggleSort = (column: TableColumnView): void => {
  if (!column.sortable) return;
  let next: SortOrder = "ascending";
  if (sortPropState.peek() === column.prop) {
    next =
      sortOrderState.peek() === "ascending"
        ? "descending"
        : sortOrderState.peek() === "descending"
          ? ""
          : "ascending";
  }
  sort(column.prop, next);
};

const sortClass = (column: TableColumnView): Record<string, boolean> => ({
  "is-sorted": sortPropState.value === column.prop && !!sortOrderState.value,
  "is-asc": sortPropState.value === column.prop && sortOrderState.value === "ascending",
  "is-desc": sortPropState.value === column.prop && sortOrderState.value === "descending"
});

const summaryCells = (): string[] => {
  const columns = getColumns();
  const data = rawRows();
  if (typeof props.summaryMethod === "function") {
    try {
      const values = props.summaryMethod({
        columns: columns.map((column) => column.raw as TableColumn),
        data
      });
      return Array.isArray(values) ? values.map((value) => String(value ?? "")) : [];
    } catch {
      return [];
    }
  }
  const labelIndex = Math.max(
    0,
    columns.findIndex((column) => column.type === "default")
  );
  return columns.map((column, index) => {
    if (index === labelIndex) return String(props.sumText || "合计");
    const values = data.map((row) => row[column.prop]);
    if (values.length === 0 || values.some((value) => typeof value !== "number")) return "";
    return String(values.reduce<number>((sum, value) => sum + Number(value), 0));
  });
};

const getWrap = (): HTMLElement | null =>
  wrapRef.value ?? host.shadowRoot?.querySelector<HTMLElement>(".table-wrap") ?? null;

const onScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const detail: TableScrollDetail = {
    scrollLeft: target.scrollLeft,
    scrollTop: target.scrollTop
  };
  emit("scroll", detail);
};

const scrollTo = (optionsOrX: ScrollToOptions | number, y = 0): void => {
  const wrap = getWrap();
  if (!wrap) return;
  if (typeof optionsOrX === "number") {
    wrap.scrollLeft = Math.max(0, optionsOrX);
    wrap.scrollTop = Math.max(0, Number(y) || 0);
    return;
  }
  if (typeof wrap.scrollTo === "function") wrap.scrollTo(optionsOrX);
  else {
    if (optionsOrX.left != null) wrap.scrollLeft = Math.max(0, Number(optionsOrX.left) || 0);
    if (optionsOrX.top != null) wrap.scrollTop = Math.max(0, Number(optionsOrX.top) || 0);
  }
};

const setScrollTop = (value: number): void => {
  const wrap = getWrap();
  if (wrap) wrap.scrollTop = Math.max(0, Number(value) || 0);
};

const setScrollLeft = (value: number): void => {
  const wrap = getWrap();
  if (wrap) wrap.scrollLeft = Math.max(0, Number(value) || 0);
};

const doLayout = (): void => {
  // Native table layout updates synchronously; touching the measured width makes
  // this method useful to callers that schedule work after a container resize.
  void getWrap()?.offsetWidth;
};

// HTMLElement already defines scrollTo. The macro intentionally warns when an
// expose shadows a platform method, so route the host method explicitly instead.
Object.defineProperty(host, "scrollTo", {
  configurable: true,
  value: scrollTo
});

defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  getSelectionRows,
  setCurrentRow,
  sort,
  clearSort,
  doLayout,
  setScrollTop,
  setScrollLeft
});

defineStyle(styles);

const Table = defineHtml<TableProps>(html`
  <div class="table-root" :class=${tableClass()}>
    <div ref="wrap" class="table-wrap" :style=${wrapStyle()} @scroll=${onScroll}>
      <table :style=${tableStyle()}>
        <colgroup>
          <col v-for="column in getColumns()" :key="column.id" :style="colStyle(column)" />
        </colgroup>
        <thead v-if=${props.showHeader}>
          <tr :class=${headerRowClass()} :style=${headerRowStyle()}>
            <th
              v-for="column in getColumns()"
              :key="column.id"
              :data-column-index=${columnIndexOf(column)}
              :class="headerCellClass(column)"
              :style="headerCellStyle(column)"
              @click=${onHeaderClick(column, $event)}
              @contextmenu=${onHeaderContextMenu(column, $event)}
            >
              <button
                v-if="column.type === 'selection'"
                type="button"
                class="table-checkbox"
                :class=${{ "is-checked": isAllSelected(), "is-indeterminate": isIndeterminate() }}
                :disabled=${selectableRows().length === 0}
                :aria-checked=${isIndeterminate() ? "mixed" : String(isAllSelected())}
                @click.stop=${onToggleAllSelection()}
                aria-label="全选"
              >
                <span class="checkbox-mark"></span>
              </button>
              <button
                v-else-if="column.sortable"
                type="button"
                class="sort-button"
                :class="sortClass(column)"
                @click=${toggleSort(column)}
              >
                <span>{{ column.label }}</span>
                <span class="sort-icon"></span>
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in getRows()" :key="row.key">
            <tr
              :class="rowClass(row)"
              :style="rowStyle(row)"
              @click=${onRowClick(row, $event)}
              @dblclick=${onRowDblClick(row, $event)}
              @contextmenu=${onRowContextMenu(row, $event)}
            >
              <td
                v-for="column in getColumns()"
                :key="column.id"
                :data-column-index=${columnIndexOf(column)}
                :class="cellClass(column, row)"
                :style="mergedCellStyle(column, row)"
                :title=${cellTitle(row, column)}
                @mouseenter=${onCellMouseEnter(row, column, $event)}
                @mouseleave=${onCellMouseLeave(row, column, $event)}
                @click=${onCellClick(row, column, $event)}
                @dblclick=${onCellDblClick(row, column, $event)}
                @contextmenu=${onCellContextMenu(row, column, $event)}
              >
                <button
                  v-if="column.type === 'selection'"
                  type="button"
                  class="table-checkbox"
                  :class="{ 'is-checked': isSelected(row) }"
                  :disabled=${!isSelectable(row)}
                  :aria-checked=${String(isSelected(row))}
                  @click.stop=${onToggleRowSelection(row)}
                  aria-label="选择行"
                >
                  <span class="checkbox-mark"></span>
                </button>
                <button
                  v-else-if="column.type === 'expand'"
                  type="button"
                  class="expand-toggle"
                  :class="{ 'is-expanded': isExpanded(row) }"
                  @click.stop=${toggleRowExpansion(row)}
                  aria-label="展开行"
                >
                  <span class="expand-icon"></span>
                </button>
                <span v-else-if="column.type === 'actions'" class="action-group">
                  <button
                    v-for="action in getActions(row, column)"
                    :key="action.label"
                    type="button"
                    class="action-button"
                    :class="actionClass(action)"
                    :disabled="action.disabled"
                    @click.stop=${invokeAction(action, row)}
                  >
                    {{ action.label }}
                  </button>
                </span>
                <span v-else class="cell-text">{{ getCell(row, column) }}</span>
              </td>
            </tr>
            <tr v-if="isExpanded(row)" class="expand-row">
              <td :colspan=${getColumns().length}>
                <div class="expand-content">{{ getExpandContent(row) }}</div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if=${props.showSummary}>
          <tr class="summary-row">
            <td
              v-for="(value, index) in summaryCells()"
              :key=${index}
              :class=${baseCellClass(getColumns()[index])}
              :style=${headerCellStyle(getColumns()[index])}
            >
              <span class="summary-text">{{ value }}</span>
            </td>
          </tr>
        </tfoot>
      </table>
      <div v-if=${getRows().length === 0} class="empty">
        <slot name="empty">${props.emptyText || "暂无数据"}</slot>
      </div>
      <div class="append"><slot name="append"></slot></div>
    </div>
    <div v-if=${props.loading} class="loading">加载中...</div>
  </div>
`);

type SortOrder = "" | "ascending" | "descending";
type ClassValue = string | Record<string, boolean> | Array<string | Record<string, boolean>>;
type StyleValue = string | Record<string, string | number>;

interface TableColumnView {
  id: string;
  prop: string;
  label: string;
  type: "default" | "selection" | "index" | "expand" | "actions";
  width: string;
  minWidth: string;
  align: "left" | "center" | "right";
  headerAlign: "left" | "center" | "right";
  sortable: boolean;
  fixed: "" | "left" | "right";
  fixedOffset: string;
  fixedLast: boolean;
  raw: Record<string, unknown>;
}

interface TableRowView {
  key: string;
  index: number;
  raw: Record<string, unknown>;
}

interface TableActionView {
  label: string;
  type: "primary" | "danger" | "default";
  disabled: boolean;
  raw: Record<string, unknown>;
}

export { Table };
