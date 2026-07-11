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
  expandFormatter?: (row: Record<string, unknown>, index: number) => unknown;
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
});
