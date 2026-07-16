// elf-table - data table with selection, sorting and pagination-friendly events

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useHost,
  useRef,
  useTemplateRef,
  watchEffect,
  defineHtml
} from "elfui";
import { directive, type DirectiveBinding } from "@elfui/runtime";

import styles from "./style.scss?inline";
import { computeAnchoredPosition } from "../../Common/anchored-overlay";
import { buildTableTree, normalizeTableTreeProps } from "./tree";
import type {
  TableCellContext,
  TableColumn,
  TableDefaultSort,
  TableFilterOption,
  TableHeaderCellContext,
  TableProps,
  TableRow,
  TableScrollDetail,
  TableSortBy,
  TableSpanResult,
  TableStyle,
  TableTreeNodeContext,
  TableRenderValue
} from "./types";

export type {
  TableAlign,
  TableCellContext,
  TableColumn,
  TableColumnType,
  TableDefaultSort,
  TableExpose,
  TableFilterMethod,
  TableFilterIconContext,
  TableFilterOption,
  TableHeaderCellContext,
  TableLayout,
  TableLoad,
  TableProps,
  TableRenderValue,
  TableRow,
  TableRowContext,
  TableRowKey,
  TableScrollDetail,
  TableSize,
  TableSortBy,
  TableSortMethod,
  TableSummaryContext,
  TableSummaryMethod,
  TableTreeNodeContext,
  TableTreeProps,
  TableSpanMethod,
  TableSpanResult,
  TableSortOrder
} from "./types";

const SIGNATURE_SEP = "::elf-table::";

const mountTableContent = (element: HTMLElement, value: TableRenderValue): void => {
  element.replaceChildren();
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    if (item == null) continue;
    if (typeof item === "object" && "nodeType" in item) element.appendChild(item);
    else element.appendChild(element.ownerDocument.createTextNode(String(item)));
  }
};

directive(
  "elf-table-content",
  (element: HTMLElement, binding: DirectiveBinding<TableRenderValue>) => {
    mountTableContent(element, binding.value);
  }
);

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
  treeProps: {
    type: Object,
    default: () => ({ children: "children", hasChildren: "hasChildren", checkStrictly: false })
  },
  indent: { type: Number, default: 16 },
  lazy: { type: Boolean, default: false },
  load: { type: Function },
  expandFormatter: { type: Function },
  sortProp: { type: String, default: "" },
  sortOrder: { type: String, default: "" },
  defaultSort: { type: Object },
  showOverflowTooltip: { type: Boolean, default: false },
  showSummary: { type: Boolean, default: false },
  sumText: { type: String, default: "合计" },
  summaryMethod: { type: Function },
  spanMethod: { type: Function }
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
  "filter-change",
  "header-dragend",
  "scroll"
]);

// Template references
const host = useHost();
const wrapRef = useTemplateRef<HTMLElement>("wrap");

const columnsState = useRef<TableColumnView[]>([]);

const rowsState = useRef<TableRowView[]>([]);

const allRowsState = useRef<TableRowView[]>([]);

const isTreeState = useRef(false);

const selectedState = useRef<string[]>([]);

const expandedState = useRef<string[]>([]);

const lazyChildrenState = useRef<Record<string, TableRow[]>>({});

const treeLoadingState = useRef<string[]>([]);

const treeLoadedState = useRef<string[]>([]);

const currentKey = useRef("");

const sortPropState = useRef("");

const sortOrderState = useRef<SortOrder>("");

const filterValuesState = useRef<Record<string, unknown[]>>({});

const filterDraftState = useRef<unknown[]>([]);

const filterOpenKey = useRef("");

const filterOverlayStyle = useRef<Record<string, string>>({});

const columnWidthsState = useRef<Record<string, number>>({});

const resizeState = useRef<TableResizeState | null>(null);

const lastSelectedSig = useRef("");

const lastExpandedSig = useRef("");

let initialized = false;
let initialExpansionApplied = false;
let externalSortObserved = false;
let filterOverlayFrame = 0;
let cleanupFilterOverlay = (): void => {};
const externalFilterSignatures = new Map<string, string>();

const normalizeKeys = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

const signature = (keys: string[]): string => keys.join(SIGNATURE_SEP);

const filterValueKey = (value: unknown): string => {
  if (value == null) return String(value);
  if (typeof value === "string") return `string:${value}`;
  if (typeof value === "number") return `number:${value}`;
  if (typeof value === "boolean") return `boolean:${value}`;
  try {
    return `${typeof value}:${JSON.stringify(value)}`;
  } catch {
    return `${typeof value}:${String(value)}`;
  }
};

const filterSignature = (values: unknown[]): string =>
  values.map(filterValueKey).join(SIGNATURE_SEP);

const cssSize = (value: unknown): string => {
  if (value == null || value === "") return "";
  return typeof value === "number" ? `${value}px` : String(value);
};

const cssSizeNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const columnSize = (
  column: TableColumnView,
  widths: Record<string, number> = columnWidthsState.peek()
): number =>
  widths[column.id]
  || cssSizeNumber(column.width || column.minWidth || "120px")
  || 120;

const columnWidth = (column: TableColumnView): string => `${columnSize(column)}px`;

const valueAtPath = (row: TableRow, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as TableRow)[key];
  }, row);

const rowKeyOf = (row: TableRow, fallback: number | string): string => {
  const key = props.rowKey;
  if (typeof key === "function") {
    try {
      return String(key(row));
    } catch {
      return String(fallback);
    }
  }
  return String(valueAtPath(row, String(key || "id")) ?? fallback);
};

const rawColumns = (): Record<string, unknown>[] =>
  Array.isArray(props.columns) ? (props.columns as Record<string, unknown>[]) : [];

const rawRows = (): TableRow[] => (Array.isArray(props.data) ? (props.data as TableRow[]) : []);

const filterKeyOf = (column: TableColumnView): string =>
  String(column.raw.columnKey || column.prop);

const filterOptionsOf = (column: TableColumnView): TableFilterOption[] => {
  const filters = Array.isArray(column.raw.filters) ? column.raw.filters : [];
  return filters
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({ text: String(item.text ?? item.value ?? ""), value: item.value }));
};

const hasFilters = (column: TableColumnView): boolean => filterOptionsOf(column).length > 0;

const filterValuesOf = (column: TableColumnView): unknown[] =>
  filterValuesState.value[filterKeyOf(column)] || [];

const syncExternalFilters = (columns: TableColumnView[]): void => {
  const next = { ...filterValuesState.peek() };
  const activeKeys = new Set<string>();
  let changed = false;

  for (const column of columns) {
    if (!hasFilters(column)) continue;
    const key = filterKeyOf(column);
    activeKeys.add(key);
    if (!Array.isArray(column.raw.filteredValue)) continue;
    const values = [...column.raw.filteredValue];
    const nextSignature = filterSignature(values);
    if (externalFilterSignatures.get(key) === nextSignature) continue;
    externalFilterSignatures.set(key, nextSignature);
    next[key] = column.raw.filterMultiple === false ? values.slice(0, 1) : values;
    changed = true;
  }

  for (const key of Object.keys(next)) {
    if (activeKeys.has(key)) continue;
    delete next[key];
    externalFilterSignatures.delete(key);
    changed = true;
  }
  if (changed) filterValuesState.set(next);
};

const normalizeColumns = (
  widths: Record<string, number> = columnWidthsState.peek()
): TableColumnView[] => {
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
      sortable: column.sortable === "custom" ? "custom" : Boolean(column.sortable),
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
    left += columnSize(column, widths);
  }
  let right = 0;
  for (const column of [...columns].reverse()) {
    if (column.fixed !== "right") continue;
    column.fixedOffset = `${right}px`;
    right += columnSize(column, widths);
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

const resolveSortValue = (
  sortBy: TableSortBy | undefined,
  row: TableRow,
  index: number,
  rows: TableRow[],
  fallbackProp: string
): unknown => {
  if (typeof sortBy === "function") {
    try {
      return sortBy(row, index, rows);
    } catch {
      return undefined;
    }
  }
  return valueAtPath(row, typeof sortBy === "string" ? sortBy : fallbackProp);
};

const compareRows = (
  left: { row: TableRow; index: number },
  right: { row: TableRow; index: number },
  column: TableColumnView,
  rows: TableRow[]
): number => {
  const method = column.raw.sortMethod;
  if (typeof method === "function") {
    try {
      return Number(method(left.row, right.row)) || 0;
    } catch {
      return 0;
    }
  }
  const sortBy = column.raw.sortBy as TableSortBy | undefined;
  if (Array.isArray(sortBy)) {
    for (const path of sortBy) {
      const result = compareValue(valueAtPath(left.row, path), valueAtPath(right.row, path));
      if (result !== 0) return result;
    }
    return 0;
  }
  return compareValue(
    resolveSortValue(sortBy, left.row, left.index, rows, column.prop),
    resolveSortValue(sortBy, right.row, right.index, rows, column.prop)
  );
};

const activeFilterColumns = (columns: TableColumnView[]): TableColumnView[] =>
  columns.filter((column) => hasFilters(column) && filterValuesOf(column).length > 0);

const matchesFilters = (row: TableRow, columns: TableColumnView[]): boolean => {
  const active = activeFilterColumns(columns);
  if (active.length === 0) return true;
  return active.every((column) => {
    const values = filterValuesOf(column);
    const method = column.raw.filterMethod;
    return values.some((value) => {
      if (typeof method === "function") {
        try {
          return Boolean(method(value, row, column.raw));
        } catch {
          return false;
        }
      }
      return filterValueKey(valueAtPath(row, column.prop)) === filterValueKey(value);
    });
  });
};

const sortedData = (columns: TableColumnView[], source: TableRow[]): TableRow[] => {
  const data = [...source];
  const prop = sortPropState.value;
  const order = sortOrderState.value;
  if (!prop || !order) return data;
  const column = columns.find((item) => item.prop === prop);
  if (column?.sortable === "custom") return data;
  const direction = order === "ascending" ? 1 : -1;
  if (!column) return data.sort((a, b) => compareValue(valueAtPath(a, prop), valueAtPath(b, prop)) * direction);
  return data
    .map((row, index) => ({ row, index }))
    .sort((left, right) => compareRows(left, right, column, data) * direction)
    .map(({ row }) => row);
};

const treeConfig = () => normalizeTableTreeProps(props.treeProps);

const treeChildrenOf = (row: TableRow, key: string): TableRow[] => {
  const loaded = lazyChildrenState.value[key];
  if (Array.isArray(loaded)) return loaded;
  const children = valueAtPath(row, treeConfig().children);
  return Array.isArray(children) ? (children as TableRow[]) : [];
};

const isTreeExpandable = (row: TableRow, key: string, children: TableRow[]): boolean => {
  if (children.length > 0) return true;
  if (!props.lazy || treeLoadedState.value.includes(key)) return false;
  return Boolean(valueAtPath(row, treeConfig().hasChildren));
};

const selectionColumn = (): TableColumnView | undefined =>
  columnsState.peek().find((column) => column.type === "selection");

const isSelectable = (row: TableRowView): boolean => {
  const selectable = selectionColumn()?.raw.selectable;
  if (typeof selectable !== "function") return true;
  try {
    return Boolean(selectable(row.raw, row.index));
  } catch {
    return true;
  }
};

const normalizeTreeSelection = (keys: string[]): string[] => {
  const rows = allRowsState.peek();
  const existing = new Set(rows.map((row) => row.key));
  const selected = new Set(keys.map(String).filter((key) => existing.has(key)));
  if (!isTreeState.peek() || treeConfig().checkStrictly) return Array.from(selected);

  for (const row of rows) {
    if (!selected.has(row.key) || !row.hasChildren) continue;
    for (const descendant of rows) {
      if (descendant.key !== row.key && descendant.path.includes(row.key) && isSelectable(descendant)) {
        selected.add(descendant.key);
      }
    }
  }
  for (const row of [...rows].sort((left, right) => right.level - left.level)) {
    if (!row.hasChildren || !isSelectable(row)) continue;
    const children = rows.filter((child) => child.parentKey === row.key && isSelectable(child));
    if (children.length === 0) continue;
    if (children.every((child) => selected.has(child.key))) {
      selected.add(row.key);
    } else {
      selected.delete(row.key);
    }
  }
  return Array.from(selected);
};

const rebuildRows = (): void => {
  const columns = normalizeColumns();
  syncExternalFilters(columns);
  const hasActiveFilters = activeFilterColumns(columns).length > 0;
  const tree = buildTableTree({
    roots: rawRows(),
    expandedKeys: new Set(expandedState.value),
    childrenOf: treeChildrenOf,
    keyOf: rowKeyOf,
    isExpandable: isTreeExpandable,
    sortRows: (rows) => sortedData(columns, rows),
    ...(hasActiveFilters ? { matchesRow: (row: TableRow) => matchesFilters(row, columns) } : {})
  });
  const rows = tree.visible as TableRowView[];
  const allRows = tree.all as TableRowView[];

  columnsState.set(columns);
  rowsState.set(rows);
  allRowsState.set(allRows);
  isTreeState.set(tree.isTree);

  const rowKeys = new Set(allRows.map((row) => row.key));
  const nextSelected = normalizeTreeSelection(selectedState.peek());
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
  const next = normalizeTreeSelection(keys);
  selectedState.set(next);
  lastSelectedSig.set(signature(next));
  if (shouldEmit) {
    emit("update:selectedKeys", next);
    emit("selection-change", getSelectionRows());
  }
};

const setExpandedKeys = (
  keys: string[],
  shouldEmit = true,
  row?: TableRowView,
  treeExpanded?: boolean
): void => {
  const rowKeys = new Set(allRowsState.peek().map((item) => item.key));
  const next = Array.from(new Set(keys.map(String).filter((key) => rowKeys.has(key))));
  expandedState.set(next);
  lastExpandedSig.set(signature(next));
  if (shouldEmit) {
    emit("update:expandedRowKeys", next);
    emit("expand-change", row?.raw, treeExpanded ?? next);
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
    const initialSortProp = String(props.sortProp || defaultSort.prop || "");
    const initialSortOrder = String(
      props.sortOrder || defaultSort.order || (initialSortProp ? "ascending" : "")
    ) as SortOrder;
    sortPropState.set(initialSortProp);
    sortOrderState.set(
      initialSortOrder === "ascending" || initialSortOrder === "descending"
        ? initialSortOrder
        : ""
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
        allRowsState.peek()
          .filter((row) => !isTreeState.peek() || row.hasChildren)
          .map((row) => row.key),
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
  if (!externalSortObserved && !nextProp && !nextOrder) return;
  externalSortObserved = true;
  const normalizedOrder =
    nextOrder === "ascending" || nextOrder === "descending"
      ? nextOrder
      : nextProp
        ? "ascending"
        : "";
  if (nextProp !== sortPropState.peek() || normalizedOrder !== sortOrderState.peek()) {
    sortPropState.set(nextProp);
    sortOrderState.set(normalizedOrder);
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
  "is-scrollbar-always": Boolean(props.scrollbarAlwaysOn),
  "is-resizing": Boolean(resizeState.value)
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
  "is-sortable": Boolean(column.sortable),
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
  const columns = getColumns();
  const index = columns.findIndex((item) => item.id === column.id);
  const adjacent = column.fixed === "left"
    ? columns.slice(0, Math.max(0, index)).filter((item) => item.fixed === "left")
    : columns.slice(index + 1).filter((item) => item.fixed === "right");
  const offset = adjacent.reduce((sum, item) => sum + columnSize(item), 0);
  return { [column.fixed]: `${offset}px` };
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

const normalizeSpan = (value: TableSpanResult | undefined): TableSpanView => {
  const [rowspan, colspan] = Array.isArray(value)
    ? value
    : [value?.rowspan ?? 1, value?.colspan ?? 1];
  const rowValue = Number(rowspan);
  const columnValue = Number(colspan);
  const normalizedRowspan = Number.isFinite(rowValue) ? Math.max(0, Math.trunc(rowValue)) : 1;
  const normalizedColspan = Number.isFinite(columnValue)
    ? Math.max(0, Math.trunc(columnValue))
    : 1;
  return {
    rowspan: normalizedRowspan,
    colspan: normalizedColspan,
    hidden: normalizedRowspan === 0 || normalizedColspan === 0
  };
};

const bodyCells = (row: TableRowView): TableCellView[] =>
  getColumns().map((column, columnIndex) => {
    let span: TableSpanResult | undefined;
    if (typeof props.spanMethod === "function") {
      try {
        span = props.spanMethod(cellContext(column, row));
      } catch {
        span = undefined;
      }
    }
    return {
      column,
      columnIndex,
      ...normalizeSpan(span)
    };
  });

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

const renderCellValue = (row: TableRowView, column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderCell;
  if (typeof renderer !== "function") return getCell(row, column);
  try {
    return renderer(cellContext(column, row)) as TableRenderValue;
  } catch {
    return getCell(row, column);
  }
};

const renderHeaderValue = (column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderHeader;
  if (typeof renderer !== "function") return column.label;
  try {
    return renderer(headerContext(column)) as TableRenderValue;
  } catch {
    return column.label;
  }
};

const hasCustomFilterIcon = (column: TableColumnView): boolean =>
  typeof column.raw.renderFilterIcon === "function";

const renderFilterIconValue = (column: TableColumnView): TableRenderValue => {
  const renderer = column.raw.renderFilterIcon;
  if (typeof renderer !== "function") return "";
  try {
    return renderer({
      column: column.raw as TableColumn,
      filtered: filterValuesOf(column).length > 0
    }) as TableRenderValue;
  } catch {
    return "";
  }
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

const selectableRows = (): TableRowView[] => rowsState.value.filter(isSelectable);

const descendantRowsOf = (row: TableRowView, includeSelf = false): TableRowView[] =>
  allRowsState
    .peek()
    .filter(
      (item) =>
        (includeSelf && item.key === row.key) ||
        (item.key !== row.key && item.path.includes(row.key))
    );

const isRowIndeterminate = (row: TableRowView): boolean => {
  if (!row.hasChildren || treeConfig().checkStrictly) return false;
  const descendants = descendantRowsOf(row).filter(isSelectable);
  const selected = descendants.filter((item) => selectedState.value.includes(item.key)).length;
  return selected > 0 && selected < descendants.length;
};

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
  const rows = allRowsState.peek();
  const row =
    typeof target === "string" || typeof target === "number"
      ? rows.find((item) => item.key === String(target))
      : rows.find((item) => item.raw === target);
  if (!row) return;
  if (!ignoreSelectable && !isSelectable(row)) return;
  const set = new Set(selectedState.peek());
  const shouldSelect = selected == null ? !set.has(row.key) : selected;
  const affected = isTreeState.peek() && !treeConfig().checkStrictly
    ? descendantRowsOf(row, true).filter((item) => ignoreSelectable || isSelectable(item))
    : [row];
  for (const item of affected) {
    if (shouldSelect) set.add(item.key);
    else set.delete(item.key);
  }
  setSelectedKeys(Array.from(set), true);
};

const toggleAllSelection = (): void => {
  const shouldClear = isAllSelected() || (isIndeterminate() && !props.selectOnIndeterminate);
  const visibleKeys = new Set(rowsState.peek().map((row) => row.key));
  const retainedKeys = selectedState.peek().filter((key) => !visibleKeys.has(key));
  const disabledKeys = selectedState.peek().filter((key) => {
    const row = rowsState.peek().find((item) => item.key === key);
    return row ? !isSelectable(row) : false;
  });
  setSelectedKeys(
    shouldClear
      ? [...retainedKeys, ...disabledKeys]
      : [...retainedKeys, ...disabledKeys, ...selectableRows().map((row) => row.key)],
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
  const rows = allRowsState.peek();
  if (typeof target === "string" || typeof target === "number") {
    return rows.find((item) => item.key === String(target));
  }
  if (target && typeof target === "object" && "key" in target && "raw" in target) {
    return target as TableRowView;
  }
  return rows.find((item) => item.raw === target);
};

const setTreeLoading = (key: string, loading: boolean): void => {
  const set = new Set(treeLoadingState.peek());
  if (loading) set.add(key);
  else set.delete(key);
  treeLoadingState.set(Array.from(set));
};

const updateKeyChildren = (key: string | number, children: TableRow[]): void => {
  const normalizedKey = String(key);
  lazyChildrenState.set({
    ...lazyChildrenState.peek(),
    [normalizedKey]: Array.isArray(children) ? children : []
  });
  treeLoadedState.set(Array.from(new Set([...treeLoadedState.peek(), normalizedKey])));
  setTreeLoading(normalizedKey, false);
  rebuildRows();
};

const loadTreeChildren = (row: TableRowView, shouldExpand: boolean): void => {
  if (typeof props.load !== "function" || treeLoadingState.peek().includes(row.key)) return;
  setTreeLoading(row.key, true);
  rebuildRows();
  let resolved = false;
  const resolve = (children: TableRow[]): void => {
    if (resolved) return;
    resolved = true;
    updateKeyChildren(row.key, children);
    if (shouldExpand && children.length > 0) {
      setExpandedKeys([...expandedState.peek(), row.key], true, row, true);
    }
  };
  const context: TableTreeNodeContext = {
    key: row.key,
    level: row.level,
    expanded: isExpanded(row),
    loading: true
  };
  try {
    const result = props.load(row.raw, context, resolve);
    if (Array.isArray(result)) resolve(result);
    else if (result && typeof result.then === "function") {
      void result
        .then((children) => {
          if (Array.isArray(children)) resolve(children);
          else if (!resolved) resolve([]);
        })
        .catch(() => {
          if (!resolved) setTreeLoading(row.key, false);
        });
    }
  } catch {
    setTreeLoading(row.key, false);
  }
};

const toggleDetailRowExpansion = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (!row) return;
  const set = new Set(expandedState.peek());
  const shouldExpand = expanded == null ? !set.has(row.key) : expanded;
  if (shouldExpand) set.add(row.key);
  else set.delete(row.key);
  setExpandedKeys(Array.from(set), true, row);
};

const toggleTreeRow = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (!row?.hasChildren) return;
  const shouldExpand = expanded == null ? !expandedState.peek().includes(row.key) : expanded;
  if (
    shouldExpand &&
    props.lazy &&
    !treeLoadedState.peek().includes(row.key) &&
    treeChildrenOf(row.raw, row.key).length === 0
  ) {
    loadTreeChildren(row, true);
    return;
  }
  const set = new Set(expandedState.peek());
  if (shouldExpand) set.add(row.key);
  else set.delete(row.key);
  setExpandedKeys(Array.from(set), true, row, shouldExpand);
};

const toggleRowExpansion = (target: unknown, expanded?: boolean): void => {
  const row = resolveRow(target);
  if (row?.hasChildren) toggleTreeRow(row, expanded);
  else toggleDetailRowExpansion(row, expanded);
};

function getSelectionRows(): Record<string, unknown>[] {
  const selected = new Set(selectedState.peek());
  return allRowsState.peek().filter((row) => selected.has(row.key)).map((row) => row.raw);
}

const setCurrentRow = (target: unknown): void => {
  const rows = allRowsState.peek();
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

const getExpandContent = (row: TableRowView): TableRenderValue => {
  const expandColumn = getColumns().find((column) => column.type === "expand");
  const renderer = expandColumn?.raw.renderExpand;
  if (typeof renderer === "function") {
    try {
      return renderer({ row: row.raw, rowIndex: row.index }) as TableRenderValue;
    } catch {
      // Fall through to the formatter/default representation.
    }
  }
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

const hasExpandColumn = (): boolean => getColumns().some((column) => column.type === "expand");

const treeColumnIndex = (): number =>
  getColumns().findIndex((column) => column.type === "default");

const isTreeCell = (row: TableRowView, columnIndex: number): boolean =>
  Boolean(isTreeState.value && columnIndex === treeColumnIndex() && row.level >= 0);

const treeCellStyle = (row: TableRowView): Record<string, string> => ({
  paddingInlineStart: `${Math.max(0, row.level * Math.max(0, Number(props.indent) || 0))}px`
});

const isTreeLoading = (row: TableRowView): boolean => treeLoadingState.value.includes(row.key);

const treeToggleLabel = (row: TableRowView): string => {
  if (isTreeLoading(row)) return "正在加载子节点";
  return isExpanded(row) ? "收起子节点" : "展开子节点";
};

const focusTreeToggle = (key: string): void => {
  queueMicrotask(() => {
    const buttons = host.shadowRoot?.querySelectorAll<HTMLButtonElement>(".tree-toggle[data-tree-key]");
    Array.from(buttons || []).find((button) => button.dataset.treeKey === key)?.focus();
  });
};

const onTreeToggleKeydown = (row: TableRowView, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleTreeRow(row);
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    if (!isExpanded(row)) toggleTreeRow(row, true);
    else {
      const child = rowsState.peek().find((item) => item.parentKey === row.key);
      if (child?.hasChildren) focusTreeToggle(child.key);
    }
    return;
  }
  if (event.key !== "ArrowLeft") return;
  event.preventDefault();
  if (isExpanded(row)) toggleTreeRow(row, false);
  else if (row.parentKey) focusTreeToggle(row.parentKey);
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

const isColumnResizable = (column: TableColumnView): boolean =>
  Boolean(props.border && column.raw.resizable !== false);

const columnMinWidth = (column: TableColumnView): number =>
  Math.max(48, cssSizeNumber(column.minWidth) || 48);

const applyColumnWidth = (column: TableColumnView, width: number): number => {
  const next = Math.max(columnMinWidth(column), Math.round(Number(width) || columnSize(column)));
  const widths = { ...columnWidthsState.peek(), [column.id]: next };
  columnWidthsState.set(widths);
  columnsState.set(normalizeColumns(widths));
  return next;
};

const cleanupColumnResize = (): void => {
  if (typeof document === "undefined") return;
  document.removeEventListener("pointermove", onResizePointerMove);
  document.removeEventListener("pointerup", onResizePointerUp);
  document.removeEventListener("pointercancel", onResizePointerCancel);
};

const onResizePointerMove = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  const column = getColumns().find((item) => item.id === state.columnId);
  if (!column) return;
  event.preventDefault();
  const currentWidth = applyColumnWidth(column, state.oldWidth + event.clientX - state.startX);
  resizeState.set({ ...state, currentWidth });
};

const finishColumnResize = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  cleanupColumnResize();
  resizeState.set(null);
  const column = getColumns().find((item) => item.id === state.columnId);
  if (column && state.currentWidth !== state.oldWidth) {
    emit("header-dragend", state.currentWidth, state.oldWidth, column.raw, event);
  }
};

const onResizePointerUp = (event: PointerEvent): void => finishColumnResize(event);

const onResizePointerCancel = (event: PointerEvent): void => {
  const state = resizeState.peek();
  if (!state || event.pointerId !== state.pointerId) return;
  const column = getColumns().find((item) => item.id === state.columnId);
  if (column) applyColumnWidth(column, state.oldWidth);
  cleanupColumnResize();
  resizeState.set(null);
};

const onResizePointerDown = (column: TableColumnView, event: PointerEvent): void => {
  if (!isColumnResizable(column) || (event.button !== 0 && event.button !== -1)) return;
  event.preventDefault();
  event.stopPropagation();
  cleanupColumnResize();
  const oldWidth = columnSize(column);
  resizeState.set({
    columnId: column.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    oldWidth,
    currentWidth: oldWidth
  });
  document.addEventListener("pointermove", onResizePointerMove, { passive: false });
  document.addEventListener("pointerup", onResizePointerUp);
  document.addEventListener("pointercancel", onResizePointerCancel);
};

const onResizeKeydown = (column: TableColumnView, event: KeyboardEvent): void => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  event.stopPropagation();
  const oldWidth = columnSize(column);
  const step = event.shiftKey ? 24 : 8;
  const nextWidth = applyColumnWidth(
    column,
    oldWidth + (event.key === "ArrowRight" ? step : -step)
  );
  if (nextWidth !== oldWidth) emit("header-dragend", nextWidth, oldWidth, column.raw, event);
};

const resizeLabel = (column: TableColumnView): string => `${column.label || "当前列"}，调整列宽`;

const isColumnResizing = (column: TableColumnView): boolean =>
  resizeState.value?.columnId === column.id;

const stopResizeClick = (event: MouseEvent): void => event.stopPropagation();

const sortOrdersOf = (column: TableColumnView): SortOrder[] => {
  const raw = Array.isArray(column.raw.sortOrders) ? column.raw.sortOrders : [];
  const normalized = raw
    .map((order): SortOrder =>
      order === "ascending" || order === "descending" ? order : ""
    )
    .filter((order, index, orders) => orders.indexOf(order) === index) as SortOrder[];
  return normalized.length > 0 ? normalized : ["ascending", "descending", ""];
};

const sort = (prop: string, order: SortOrder = "ascending"): void => {
  const normalizedOrder =
    order === "ascending" || order === "descending" ? order : "";
  sortPropState.set(prop);
  sortOrderState.set(normalizedOrder);
  rebuildRows();
  emit("sort-change", {
    column: getColumns().find((column) => column.prop === prop)?.raw,
    prop,
    order: normalizedOrder
  });
};

const clearSort = (): void => sort("", "");

const toggleSort = (column: TableColumnView): void => {
  if (!column.sortable) return;
  const orders = sortOrdersOf(column);
  const currentIndex =
    sortPropState.peek() === column.prop ? orders.indexOf(sortOrderState.peek()) : -1;
  const next = orders[(currentIndex + 1) % orders.length] || "";
  sort(column.prop, next);
};

const sortClass = (column: TableColumnView): Record<string, boolean> => ({
  "is-sorted": sortPropState.value === column.prop && !!sortOrderState.value,
  "is-asc": sortPropState.value === column.prop && sortOrderState.value === "ascending",
  "is-desc": sortPropState.value === column.prop && sortOrderState.value === "descending"
});

const ariaSort = (column: TableColumnView): "ascending" | "descending" | "none" | undefined => {
  if (!column.sortable) return undefined;
  if (sortPropState.value !== column.prop) return "none";
  return sortOrderState.value || "none";
};

const sortLabel = (column: TableColumnView): string => {
  const order = ariaSort(column);
  const state = order === "ascending" ? "升序" : order === "descending" ? "降序" : "未排序";
  return `${column.label}，${state}`;
};

const activeFilterColumn = (): TableColumnView | undefined =>
  getColumns().find((column) => filterKeyOf(column) === filterOpenKey.value);

const filterPlacementOf = (column: TableColumnView): FilterPlacement => {
  const placement = String(column.raw.filterPlacement || "bottom-start");
  return FILTER_PLACEMENTS.includes(placement as FilterPlacement)
    ? placement as FilterPlacement
    : "bottom-start";
};

const filterPanelClass = (column: TableColumnView): ClassValue => [
  "filter-panel",
  String(column.raw.filterClassName || ""),
  { "is-multiple": column.raw.filterMultiple !== false }
];

const isFilterActive = (column: TableColumnView): boolean => filterValuesOf(column).length > 0;

const filterButtonClass = (column: TableColumnView): Record<string, boolean> => ({
  "is-active": isFilterActive(column),
  "is-open": filterOpenKey.value === filterKeyOf(column),
  "has-custom-icon": hasCustomFilterIcon(column)
});

const filterLabel = (column: TableColumnView): string => {
  const count = filterValuesOf(column).length;
  return count > 0 ? `${column.label}，已选择 ${count} 个筛选条件` : `${column.label}，筛选`;
};

const filterPanelLabel = (column: TableColumnView): string => `${column.label}筛选选项`;

const filterValueEquals = (left: unknown, right: unknown): boolean =>
  filterValueKey(left) === filterValueKey(right);

const isDraftFilterSelected = (value: unknown): boolean =>
  filterDraftState.value.some((item) => filterValueEquals(item, value));

const filterOptionViews = (column: TableColumnView): TableFilterOptionView[] =>
  filterOptionsOf(column).map((option) => ({
    ...option,
    selected: isDraftFilterSelected(option.value)
  }));

const filterChangePayload = (): Record<string, unknown[]> =>
  Object.fromEntries(
    getColumns()
      .filter(hasFilters)
      .map((column) => [filterKeyOf(column), [...filterValuesOf(column)]])
  );

const setAppliedFilters = (column: TableColumnView, values: unknown[], shouldEmit = true): void => {
  const key = filterKeyOf(column);
  const allowed = filterOptionsOf(column);
  const normalized = values
    .filter((value, index, source) =>
      source.findIndex((item) => filterValueEquals(item, value)) === index
      && allowed.some((option) => filterValueEquals(option.value, value))
    );
  const nextValues = column.raw.filterMultiple === false ? normalized.slice(0, 1) : normalized;
  const current = filterValuesState.peek()[key] || [];
  if (filterSignature(current) === filterSignature(nextValues)) return;
  filterValuesState.set({ ...filterValuesState.peek(), [key]: nextValues });
  rebuildRows();
  if (shouldEmit) emit("filter-change", filterChangePayload());
};

const clearFilter = (columnKeys?: string | string[]): void => {
  const requested = columnKeys == null
    ? null
    : new Set((Array.isArray(columnKeys) ? columnKeys : [columnKeys]).map(String));
  const columns = getColumns().filter((column) =>
    hasFilters(column) && (!requested || requested.has(filterKeyOf(column)))
  );
  if (columns.length === 0 || !columns.some((column) => filterValuesOf(column).length > 0)) return;
  const next = { ...filterValuesState.peek() };
  for (const column of columns) next[filterKeyOf(column)] = [];
  filterValuesState.set(next);
  if (activeFilterColumn() && columns.includes(activeFilterColumn()!)) filterDraftState.set([]);
  rebuildRows();
  emit("filter-change", filterChangePayload());
};

const getFilterTrigger = (key = filterOpenKey.peek()): HTMLButtonElement | null =>
  Array.from(host.shadowRoot?.querySelectorAll<HTMLButtonElement>("[data-filter-trigger]") || [])
    .find((item) => item.dataset.filterKey === key) || null;

const getFilterPanel = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement>(".filter-panel") || null;

const updateFilterOverlayPosition = (): void => {
  if (typeof window === "undefined") return;
  const column = activeFilterColumn();
  const trigger = getFilterTrigger();
  const panel = getFilterPanel();
  if (!column || !trigger || !panel) return;
  const anchorRect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const viewport = window.visualViewport;
  const position = computeAnchoredPosition(
    anchorRect,
    { width: Math.max(panelRect.width, 184), height: panelRect.height },
    {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight,
      offsetLeft: viewport?.offsetLeft || 0,
      offsetTop: viewport?.offsetTop || 0
    },
    { placement: filterPlacementOf(column), offset: [0, 7], padding: 8, flip: true }
  );
  filterOverlayStyle.set({
    position: "fixed",
    left: `${position.left}px`,
    top: `${position.top}px`
  });
};

const requestFilterOverlayUpdate = (): void => {
  if (typeof window === "undefined") return;
  if (filterOverlayFrame) window.cancelAnimationFrame(filterOverlayFrame);
  filterOverlayFrame = window.requestAnimationFrame(() => {
    filterOverlayFrame = 0;
    updateFilterOverlayPosition();
  });
};

const connectFilterOverlay = (): void => {
  cleanupFilterOverlay();
  if (!filterOpenKey.peek() || typeof window === "undefined") return;
  const observer = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(requestFilterOverlayUpdate)
    : undefined;
  const trigger = getFilterTrigger();
  const panel = getFilterPanel();
  if (trigger) observer?.observe(trigger);
  if (panel) observer?.observe(panel);
  window.addEventListener("resize", requestFilterOverlayUpdate, { passive: true });
  window.addEventListener("scroll", requestFilterOverlayUpdate, { passive: true, capture: true });
  window.visualViewport?.addEventListener("resize", requestFilterOverlayUpdate, { passive: true });
  window.visualViewport?.addEventListener("scroll", requestFilterOverlayUpdate, { passive: true });
  cleanupFilterOverlay = () => {
    observer?.disconnect();
    window.removeEventListener("resize", requestFilterOverlayUpdate);
    window.removeEventListener("scroll", requestFilterOverlayUpdate, { capture: true });
    window.visualViewport?.removeEventListener("resize", requestFilterOverlayUpdate);
    window.visualViewport?.removeEventListener("scroll", requestFilterOverlayUpdate);
  };
};

const syncFilterTopLayer = (): void => {
  const panel = getFilterPanel() as (HTMLElement & { showPopover?: () => void }) | null;
  try {
    panel?.showPopover?.();
  } catch {
    // The panel may be replaced while the reactive template updates.
  }
  requestFilterOverlayUpdate();
};

const openFilterPanel = (column: TableColumnView): void => {
  const key = filterKeyOf(column);
  filterOpenKey.set(key);
  filterDraftState.set([...(filterValuesState.peek()[key] || [])]);
  queueMicrotask(() => {
    syncFilterTopLayer();
    connectFilterOverlay();
    getFilterPanel()?.querySelector<HTMLButtonElement>(".filter-option")?.focus();
  });
};

const closeFilterPanel = (returnFocus = false): void => {
  const key = filterOpenKey.peek();
  const panel = getFilterPanel() as (HTMLElement & { hidePopover?: () => void }) | null;
  try {
    panel?.hidePopover?.();
  } catch {
    // A disconnected popover is already closed by the browser.
  }
  filterOpenKey.set("");
  filterDraftState.set([]);
  cleanupFilterOverlay();
  if (returnFocus) getFilterTrigger(key)?.focus();
};

const toggleFilterPanel = (column: TableColumnView): void => {
  if (filterOpenKey.peek() === filterKeyOf(column)) closeFilterPanel();
  else openFilterPanel(column);
};

const toggleFilterDraft = (column: TableColumnView, value: unknown): void => {
  if (column.raw.filterMultiple === false) {
    setAppliedFilters(column, [value]);
    closeFilterPanel(true);
    return;
  }
  const next = [...filterDraftState.peek()];
  const index = next.findIndex((item) => filterValueEquals(item, value));
  if (index >= 0) next.splice(index, 1);
  else next.push(value);
  filterDraftState.set(next);
};

const applyFilterDraft = (column: TableColumnView): void => {
  setAppliedFilters(column, filterDraftState.peek());
  closeFilterPanel(true);
};

const resetFilter = (column: TableColumnView): void => {
  setAppliedFilters(column, []);
  closeFilterPanel(true);
};

const onFilterTriggerKeydown = (column: TableColumnView, event: KeyboardEvent): void => {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
    event.preventDefault();
    openFilterPanel(column);
  } else if (event.key === "Escape" && filterOpenKey.peek() === filterKeyOf(column)) {
    event.preventDefault();
    closeFilterPanel(true);
  }
};

const onFilterPanelKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  closeFilterPanel(true);
};

const onDocumentPointerDown = (event: PointerEvent): void => {
  if (filterOpenKey.peek() && !event.composedPath().includes(host)) closeFilterPanel();
};

const summaryCells = (): string[] => {
  const columns = getColumns();
  const data = rowsState.value.map((row) => row.raw);
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

onMount(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
});

onUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  cleanupColumnResize();
  cleanupFilterOverlay();
  if (filterOverlayFrame && typeof window !== "undefined") {
    window.cancelAnimationFrame(filterOverlayFrame);
  }
});

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
  updateKeyChildren,
  getSelectionRows,
  setCurrentRow,
  sort,
  clearSort,
  clearFilter,
  doLayout,
  setScrollTop,
  setScrollLeft
});

defineStyle(styles);

const Table = defineHtml<TableProps>(html`
  <div class="table-root" :class=${tableClass()}>
    <div ref="wrap" class="table-wrap" :style=${wrapStyle()} @scroll=${onScroll}>
      <table :style=${tableStyle()} :role=${isTreeState.value ? "treegrid" : null}>
        <colgroup>
          <col v-for="column in getColumns()" :key="column.id" :style="colStyle(column)" />
        </colgroup>
        <thead v-if=${props.showHeader}>
          <tr :class=${headerRowClass()} :style=${headerRowStyle()}>
            <th
              v-for="column in getColumns()"
              :key="column.id"
              :data-column-index=${columnIndexOf(column)}
              :aria-sort=${ariaSort(column)}
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
              <span v-else class="header-content">
                <button
                  v-if="column.sortable"
                  type="button"
                  class="sort-button"
                  :class="sortClass(column)"
                  :aria-label=${sortLabel(column)}
                  @click=${toggleSort(column)}
                >
                  <span class="rendered-content" v-elf-table-content=${renderHeaderValue(column)}></span>
                  <span class="sort-icon"></span>
                </button>
                <span
                  v-else
                  class="rendered-content"
                  v-elf-table-content=${renderHeaderValue(column)}
                ></span>
                <button
                  v-if=${hasFilters(column)}
                  type="button"
                  class="filter-trigger"
                  :class=${filterButtonClass(column)}
                  data-filter-trigger
                  :data-filter-key=${filterKeyOf(column)}
                  aria-haspopup="listbox"
                  :aria-expanded=${String(filterOpenKey.value === filterKeyOf(column))}
                  :aria-label=${filterLabel(column)}
                  @click.stop=${toggleFilterPanel(column)}
                  @keydown=${onFilterTriggerKeydown(column, $event)}
                >
                  <span
                    class="filter-icon"
                    aria-hidden="true"
                    v-elf-table-content=${renderFilterIconValue(column)}
                  ></span>
                </button>
                <div
                  v-if=${filterOpenKey.value === filterKeyOf(column)}
                  popover="manual"
                  :class=${filterPanelClass(column)}
                  :style=${filterOverlayStyle.value}
                  role="listbox"
                  :aria-multiselectable=${String(column.raw.filterMultiple !== false)}
                  :aria-label=${filterPanelLabel(column)}
                  @keydown=${onFilterPanelKeydown}
                >
                  <div class="filter-options">
                    <button
                      v-for="option in filterOptionViews(column)"
                      :key=${filterValueKey(option.value)}
                      type="button"
                      class="filter-option"
                      :class=${{ "is-selected": option.selected }}
                      role="option"
                      :aria-selected=${String(option.selected)}
                      @click=${toggleFilterDraft(column, option.value)}
                    >
                      <span class="filter-check" aria-hidden="true"></span>
                      <span>{{ option.text }}</span>
                    </button>
                  </div>
                  <div class="filter-actions">
                    <button type="button" @click=${resetFilter(column)}>重置</button>
                    <button
                      v-if=${column.raw.filterMultiple !== false}
                      type="button"
                      class="is-primary"
                      @click=${applyFilterDraft(column)}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </span>
              <span
                v-if=${isColumnResizable(column)}
                class="column-resizer"
                :class=${{ "is-active": isColumnResizing(column) }}
                role="separator"
                tabindex="0"
                aria-orientation="vertical"
                :aria-label=${resizeLabel(column)}
                :aria-valuemin=${columnMinWidth(column)}
                :aria-valuenow=${columnSize(column)}
                @pointerdown=${onResizePointerDown(column, $event)}
                @keydown=${onResizeKeydown(column, $event)}
                @click.stop=${stopResizeClick}
              ></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in getRows()" :key="row.key">
            <tr
              :class="rowClass(row)"
              :style="rowStyle(row)"
              :aria-level=${isTreeState.value ? String(row.level + 1) : null}
              :aria-expanded=${row.hasChildren ? String(isExpanded(row)) : null}
              @click=${onRowClick(row, $event)}
              @dblclick=${onRowDblClick(row, $event)}
              @contextmenu=${onRowContextMenu(row, $event)}
            >
              <template v-for="cell in bodyCells(row)" :key="cell.column.id">
                <td
                  v-if=${!cell.hidden}
                  :rowspan=${cell.rowspan}
                  :colspan=${cell.colspan}
                  :data-column-index=${cell.columnIndex}
                  :class=${cellClass(cell.column, row)}
                  :style=${mergedCellStyle(cell.column, row)}
                  :title=${cellTitle(row, cell.column)}
                  @mouseenter=${onCellMouseEnter(row, cell.column, $event)}
                  @mouseleave=${onCellMouseLeave(row, cell.column, $event)}
                  @click=${onCellClick(row, cell.column, $event)}
                  @dblclick=${onCellDblClick(row, cell.column, $event)}
                  @contextmenu=${onCellContextMenu(row, cell.column, $event)}
                >
                <button
                  v-if="cell.column.type === 'selection'"
                  type="button"
                  class="table-checkbox"
                  :class="{ 'is-checked': isSelected(row), 'is-indeterminate': isRowIndeterminate(row) }"
                  :disabled=${!isSelectable(row)}
                  :aria-checked=${isRowIndeterminate(row) ? "mixed" : String(isSelected(row))}
                  @click.stop=${onToggleRowSelection(row)}
                  aria-label="选择行"
                >
                  <span class="checkbox-mark"></span>
                </button>
                <button
                  v-else-if="cell.column.type === 'expand'"
                  type="button"
                  class="expand-toggle"
                  :class="{ 'is-expanded': isExpanded(row) }"
                  @click.stop=${row.hasChildren ? toggleTreeRow(row) : toggleDetailRowExpansion(row)}
                  aria-label="展开行"
                >
                  <span class="expand-icon"></span>
                </button>
                <span v-else-if="cell.column.type === 'actions'" class="action-group">
                  <button
                    v-for="action in getActions(row, cell.column)"
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
                <span
                  v-else-if=${isTreeCell(row, cell.columnIndex)}
                  class="tree-cell"
                  :style=${treeCellStyle(row)}
                >
                  <button
                    v-if=${row.hasChildren}
                    type="button"
                    class="tree-toggle"
                    :class="{ 'is-expanded': isExpanded(row), 'is-loading': isTreeLoading(row) }"
                    :data-tree-key=${row.key}
                    :disabled=${isTreeLoading(row)}
                    :aria-expanded=${String(isExpanded(row))}
                    :aria-label=${treeToggleLabel(row)}
                    @click.stop=${toggleTreeRow(row)}
                    @keydown=${onTreeToggleKeydown(row, $event)}
                  >
                    <span class="tree-toggle-icon" aria-hidden="true"></span>
                  </button>
                  <span v-else class="tree-toggle-spacer" aria-hidden="true"></span>
                  <span
                    class="cell-text rendered-content"
                    v-elf-table-content=${renderCellValue(row, cell.column)}
                  ></span>
                </span>
                <span
                  v-else
                  class="cell-text rendered-content"
                  v-elf-table-content=${renderCellValue(row, cell.column)}
                ></span>
                </td>
              </template>
            </tr>
            <tr v-if=${hasExpandColumn() && !row.hasChildren && isExpanded(row)} class="expand-row">
              <td :colspan=${getColumns().length}>
                <div
                  class="expand-content rendered-content"
                  v-elf-table-content=${getExpandContent(row)}
                ></div>
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
type FilterPlacement = "bottom" | "bottom-start" | "bottom-end" | "top" | "top-start" | "top-end";
type ClassValue = string | Record<string, boolean> | Array<string | Record<string, boolean>>;
type StyleValue = string | Record<string, string | number>;

const FILTER_PLACEMENTS: FilterPlacement[] = [
  "bottom",
  "bottom-start",
  "bottom-end",
  "top",
  "top-start",
  "top-end"
];

interface TableColumnView {
  id: string;
  prop: string;
  label: string;
  type: "default" | "selection" | "index" | "expand" | "actions";
  width: string;
  minWidth: string;
  align: "left" | "center" | "right";
  headerAlign: "left" | "center" | "right";
  sortable: boolean | "custom";
  fixed: "" | "left" | "right";
  fixedOffset: string;
  fixedLast: boolean;
  raw: Record<string, unknown>;
}

interface TableRowView {
  key: string;
  index: number;
  raw: Record<string, unknown>;
  level: number;
  parentKey: string;
  path: string[];
  hasChildren: boolean;
}

interface TableActionView {
  label: string;
  type: "primary" | "danger" | "default";
  disabled: boolean;
  raw: Record<string, unknown>;
}

interface TableSpanView {
  rowspan: number;
  colspan: number;
  hidden: boolean;
}

interface TableFilterOptionView extends TableFilterOption {
  selected: boolean;
}

interface TableResizeState {
  columnId: string;
  pointerId: number;
  startX: number;
  oldWidth: number;
  currentWidth: number;
}

interface TableCellView extends TableSpanView {
  column: TableColumnView;
  columnIndex: number;
}

export { Table };
