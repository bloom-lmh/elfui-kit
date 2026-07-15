import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TableEl extends HTMLElement {
  data?: unknown[];
  columns?: unknown[];
  rowKey?: string;
  stripe?: boolean;
  border?: boolean;
  stickyHeader?: boolean;
  highlightCurrentRow?: boolean;
  defaultSelectedKeys?: string[];
  defaultExpandedRowKeys?: string[];
  defaultExpandAll?: boolean;
  defaultSort?: { prop: string; order: "ascending" | "descending" };
  rowClassName?: string | ((context: { row: Record<string, unknown>; rowIndex: number }) => string);
  rowStyle?: (context: { row: Record<string, unknown>; rowIndex: number }) => Record<string, string>;
  cellClassName?: (context: {
    row: Record<string, unknown>;
    column: Record<string, unknown>;
    rowIndex: number;
    columnIndex: number;
  }) => string;
  headerCellStyle?: (context: {
    column: Record<string, unknown>;
    columnIndex: number;
  }) => Record<string, string>;
  showSummary?: boolean;
  showOverflowTooltip?: boolean;
  selectOnIndeterminate?: boolean;
  expandFormatter?: (row: Record<string, unknown>, index: number) => unknown;
  setScrollTop(value: number): void;
  setScrollLeft(value: number): void;
  scrollTo(x: number, y?: number): void;
  toggleAllSelection(): void;
  getSelectionRows(): Record<string, unknown>[];
}

const rows = [
  { id: "1", name: "Alice", role: "Admin", score: 96 },
  { id: "2", name: "Bob", role: "Editor", score: 82 },
  { id: "3", name: "Carol", role: "Viewer", score: 90 }
];

const columns = [
  { type: "selection", width: 48 },
  { type: "index", label: "#", width: 56 },
  { prop: "name", label: "姓名" },
  { prop: "role", label: "角色" },
  { prop: "score", label: "分数", sortable: true, align: "right" }
];

const mount = async (setup?: (el: TableEl) => void): Promise<TableEl> => {
  const el = document.createElement("elf-table") as TableEl;
  el.data = rows;
  el.columns = columns;
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-table", () => {
  it("渲染表头和数据行", async () => {
    const el = await mount();

    expect(el.shadowRoot!.textContent).toContain("姓名");
    expect(el.shadowRoot!.textContent).toContain("Alice");
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(3);
  });

  it("支持 stripe 和 border 样式", async () => {
    const el = await mount((table) => {
      table.stripe = true;
      table.border = true;
    });

    const root = el.shadowRoot!.querySelector(".table-root")!;
    expect(root.classList.contains("is-stripe")).toBe(true);
    expect(root.classList.contains("is-border")).toBe(true);
  });

  it("点击排序列触发 sort-change 并重排行", async () => {
    const el = await mount();
    const onSort = vi.fn();
    el.addEventListener("sort-change", onSort as EventListener);

    const sortButton = el.shadowRoot!.querySelector(".sort-button") as HTMLButtonElement;
    sortButton.click();
    await tick();

    expect(onSort).toHaveBeenCalled();
    expect((onSort.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      prop: "score",
      order: "ascending"
    });
    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Bob");
  });

  it("支持行选择和 selection-change", async () => {
    const el = await mount();
    const onSelection = vi.fn();
    el.addEventListener("selection-change", onSelection as EventListener);

    const checkbox = el.shadowRoot!.querySelector("tbody .table-checkbox") as HTMLButtonElement;
    checkbox.click();
    await tick();

    expect(onSelection).toHaveBeenCalled();
    expect((onSelection.mock.calls[0]![0] as CustomEvent).detail[0].id).toBe("1");
  });

  it("默认选中 key 可回显", async () => {
    const el = await mount((table) => {
      table.defaultSelectedKeys = ["2"];
    });

    expect(el.shadowRoot!.querySelector("tbody tr.is-selected")?.textContent).toContain("Bob");
  });

  it("点击行触发 current-change 和 row-click", async () => {
    const el = await mount((table) => {
      table.highlightCurrentRow = true;
    });
    const onCurrent = vi.fn();
    const onRow = vi.fn();
    el.addEventListener("current-change", onCurrent as EventListener);
    el.addEventListener("row-click", onRow as EventListener);

    const secondRow = el.shadowRoot!.querySelectorAll("tbody tr")[1] as HTMLTableRowElement;
    secondRow.click();
    await tick();

    expect(onCurrent).toHaveBeenCalled();
    expect(onRow).toHaveBeenCalled();
    expect(secondRow.classList.contains("is-current")).toBe(true);
  });

  it("无数据时显示空状态", async () => {
    const el = await mount((table) => {
      table.data = [];
    });

    expect(el.shadowRoot!.querySelector(".empty")?.textContent).toContain("暂无数据");
  });

  it("支持操作列并触发 action-click 与 onClick", async () => {
    const onAction = vi.fn();
    const onClick = vi.fn();
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          type: "actions",
          label: "操作",
          actions: [{ label: "编辑", type: "primary", onClick }]
        }
      ];
    });
    el.addEventListener("action-click", onAction as EventListener);

    const edit = el.shadowRoot!.querySelector(".action-button") as HTMLButtonElement;
    edit.click();
    await tick();

    expect(onClick).toHaveBeenCalledWith(rows[0], 0, expect.objectContaining({ label: "编辑" }));
    expect(onAction).toHaveBeenCalled();
    expect((onAction.mock.calls[0]![0] as CustomEvent).detail[1].name).toBe("Alice");
  });

  it("支持单元格样式函数", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名" },
        {
          prop: "score",
          label: "分数",
          cellStyle: (row: Record<string, unknown>) => ({
            color: Number(row.score) > 90 ? "rgb(46, 125, 50)" : "rgb(211, 47, 47)"
          })
        }
      ];
    });

    const scoreCell =
      el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody tr:first-child td")[1]!;
    expect(scoreCell.style.color).toBe("rgb(46, 125, 50)");
  });

  it("支持展开行详情", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "expand", width: 48 },
        { prop: "name", label: "姓名" }
      ];
      table.expandFormatter = (row) => `详情：${row.name}`;
    });
    const onExpand = vi.fn();
    el.addEventListener("expand-change", onExpand as EventListener);

    const toggle = el.shadowRoot!.querySelector(".expand-toggle") as HTMLButtonElement;
    toggle.click();
    await tick();

    expect(onExpand).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".expand-row")?.textContent).toContain("详情：Alice");
    expect(toggle.classList.contains("is-expanded")).toBe(true);
  });

  it("支持固定列和 sticky 表头", async () => {
    const el = await mount((table) => {
      table.columns = [
        { prop: "name", label: "姓名", width: 120, fixed: "left" },
        { prop: "role", label: "角色", width: 120 },
        { prop: "score", label: "分数", width: 100, fixed: "right" }
      ];
    });

    const root = el.shadowRoot!.querySelector(".table-root")!;
    const fixedLeft = el.shadowRoot!.querySelector("th.is-fixed-left") as HTMLElement;
    const fixedRight = el.shadowRoot!.querySelector("th.is-fixed-right") as HTMLElement;

    expect(root.classList.contains("is-sticky-header")).toBe(true);
    expect(fixedLeft.style.left).toBe("0px");
    expect(fixedRight.style.right).toBe("0px");
    expect(el.shadowRoot!.querySelector("td.is-fixed-left")).toBeTruthy();
  });

  it("固定列同步显式列宽，避免横向滚动时宽度抖动", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "selection", width: 48, fixed: "left" },
        { type: "index", label: "编号", width: 56, fixed: "left" },
        { prop: "name", label: "姓名", width: 180 },
        { prop: "role", label: "角色", width: 160 },
        { prop: "score", label: "分数", width: 120, fixed: "right" }
      ];
    });

    const table = el.shadowRoot!.querySelector("table") as HTMLTableElement;
    const indexHeader = el.shadowRoot!.querySelector("th.is-index") as HTMLElement;
    const indexCell = el.shadowRoot!.querySelector("td.is-index") as HTMLElement;

    expect(table.style.minWidth).toBe("564px");
    expect(indexHeader.style.left).toBe("48px");
    expect(indexHeader.style.width).toBe("56px");
    expect(indexHeader.style.minWidth).toBe("56px");
    expect(indexHeader.style.maxWidth).toBe("56px");
    expect(indexCell.style.width).toBe("56px");
    expect(indexCell.style.minWidth).toBe("56px");
    expect(indexCell.style.maxWidth).toBe("56px");
  });

  it("使用 Element Plus 风格上下文设置行、单元格与表头样式", async () => {
    const rowStyle = vi.fn(({ rowIndex }) => ({
      backgroundColor: rowIndex === 1 ? "rgb(255, 248, 225)" : ""
    }));
    const cellClassName = vi.fn(({ columnIndex }) => (columnIndex === 2 ? "name-cell" : ""));
    const el = await mount((table) => {
      table.rowClassName = ({ row }) => (row.role === "Admin" ? "admin-row" : "");
      table.rowStyle = rowStyle;
      table.cellClassName = cellClassName;
      table.headerCellStyle = ({ columnIndex }) => ({
        color: columnIndex === 2 ? "rgb(25, 118, 210)" : ""
      });
    });

    const bodyRows = el.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    const nameHeader = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("thead th")[2]!;
    const nameCell = bodyRows[0]!.querySelectorAll<HTMLTableCellElement>("td")[2]!;

    expect(bodyRows[0]!.classList.contains("admin-row")).toBe(true);
    expect(bodyRows[1]!.style.backgroundColor).toBe("rgb(255, 248, 225)");
    expect(nameCell.classList.contains("name-cell")).toBe(true);
    expect(nameHeader.style.color).toBe("rgb(25, 118, 210)");
    expect(rowStyle).toHaveBeenCalledWith(expect.objectContaining({ row: rows[0], rowIndex: 0 }));
    expect(cellClassName).toHaveBeenCalledWith(
      expect.objectContaining({ row: rows[0], column: columns[2], columnIndex: 2 })
    );
  });

  it("补齐表头、单元格与行级鼠标事件参数", async () => {
    const el = await mount();
    const onHeader = vi.fn();
    const onCell = vi.fn();
    const onDblClick = vi.fn();
    el.addEventListener("header-click", onHeader as EventListener);
    el.addEventListener("cell-click", onCell as EventListener);
    el.addEventListener("row-dblclick", onDblClick as EventListener);

    const header = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("thead th")[2]!;
    const cell = el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[2]!;
    header.click();
    cell.click();
    cell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    expect((onHeader.mock.calls[0]![0] as CustomEvent).detail[0]).toEqual(columns[2]);
    expect((onCell.mock.calls[0]![0] as CustomEvent).detail.slice(0, 2)).toEqual([
      rows[0],
      columns[2]
    ]);
    expect((onDblClick.mock.calls[0]![0] as CustomEvent).detail.slice(0, 2)).toEqual([
      rows[0],
      columns[2]
    ]);
  });

  it("遵守 selectable 与 select-on-indeterminate，并触发 select/select-all", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "selection", selectable: (row: Record<string, unknown>) => row.role !== "Viewer" },
        { prop: "name", label: "姓名" }
      ];
      table.selectOnIndeterminate = false;
    });
    const onSelect = vi.fn();
    const onSelectAll = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    el.addEventListener("select-all", onSelectAll as EventListener);

    const checkboxes = el.shadowRoot!.querySelectorAll<HTMLButtonElement>("tbody .table-checkbox");
    expect(checkboxes[2]!.disabled).toBe(true);
    checkboxes[0]!.click();
    await tick();
    expect(onSelect).toHaveBeenCalled();
    expect(el.getSelectionRows()).toEqual([rows[0]]);

    el.shadowRoot!.querySelector<HTMLButtonElement>("thead .table-checkbox")!.click();
    await tick();
    expect(onSelectAll).toHaveBeenCalled();
    expect(el.getSelectionRows()).toEqual([]);
  });

  it("支持默认排序、默认展开、汇总行和溢出提示", async () => {
    const el = await mount((table) => {
      table.columns = [
        { type: "expand", width: 48 },
        { prop: "name", label: "姓名", width: 120 },
        { prop: "score", label: "分数", width: 100 }
      ];
      table.defaultSort = { prop: "score", order: "descending" };
      table.defaultExpandAll = true;
      table.showSummary = true;
      table.showOverflowTooltip = true;
    });

    expect(el.shadowRoot!.querySelector("tbody tr")?.textContent).toContain("Alice");
    expect(el.shadowRoot!.querySelectorAll(".expand-row")).toHaveLength(3);
    expect(el.shadowRoot!.querySelector("tfoot")?.textContent).toContain("268");
    expect(el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tfoot td")[1]!.textContent).toContain(
      "合计"
    );
    expect(el.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[1]!.title).toBe(
      "Alice"
    );
  });

  it("支持 empty/append 插槽、scroll 事件与滚动公开方法", async () => {
    const el = document.createElement("elf-table") as TableEl;
    el.data = [];
    el.columns = [{ prop: "name", label: "姓名", width: 240 }];
    el.innerHTML = '<strong slot="empty">没有匹配结果</strong><span slot="append">加载更多</span>';
    const onScroll = vi.fn();
    el.addEventListener("scroll", onScroll as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    const wrap = el.shadowRoot!.querySelector<HTMLElement>(".table-wrap")!;
    Object.defineProperty(wrap, "scrollTop", { value: 0, configurable: true, writable: true });
    Object.defineProperty(wrap, "scrollLeft", { value: 0, configurable: true, writable: true });
    el.setScrollTop(40);
    el.setScrollLeft(18);
    expect(wrap.scrollTop).toBe(40);
    expect(wrap.scrollLeft).toBe(18);
    el.scrollTo(7, 12);
    expect(wrap.scrollLeft).toBe(7);
    expect(wrap.scrollTop).toBe(12);

    wrap.dispatchEvent(new Event("scroll"));
    expect((onScroll.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      scrollLeft: 7,
      scrollTop: 12
    });
    expect(el.shadowRoot!.querySelector("slot[name='empty']")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("slot[name='append']")).toBeTruthy();
  });
});
