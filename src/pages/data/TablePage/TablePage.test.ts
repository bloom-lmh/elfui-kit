import { afterEach, beforeAll, describe, expect, it } from "vitest";

let tablePaginationTag = "";
let tableActionTag = "";
let tableAdvancedTag = "";
let tableSpanTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageTableEx2 } = await import("./ex2");
  const { PageTableEx9 } = await import("./ex9");
  const { PageTableEx13 } = await import("./ex13");
  const { PageTableEx14 } = await import("./ex14");
  tablePaginationTag = ensureCustomElement(PageTableEx2);
  tableActionTag = ensureCustomElement(PageTableEx9);
  tableAdvancedTag = ensureCustomElement(PageTableEx13);
  tableSpanTag = ensureCustomElement(PageTableEx14);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let text = "";

  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }

    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };

  visit(root);
  return text;
};

describe("TablePage", () => {
  it("表格示例可以和分页组件联动", async () => {
    const el = document.createElement(tablePaginationTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(collectText(el)).toContain("展示 1-5 / 37 条");

    const pagination = el.shadowRoot!.querySelector("elf-pagination")!;
    const next = pagination.shadowRoot!.querySelector<HTMLButtonElement>(
      'button[aria-label="下一页"]'
    )!;
    next.click();
    await tick();
    await tick();

    const text = collectText(el);
    expect(text).toContain("展示 6-10 / 37 条");
    expect(text).toContain("ELF-2026006");
  });

  it("操作列删除按钮可以通过 Dialog 确认删除当前行", async () => {
    const el = document.createElement(tableActionTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(collectText(el)).toContain("支付网关");

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const deleteButton = Array.from(
      table.shadowRoot!.querySelectorAll<HTMLButtonElement>(".action-button")
    ).find((button) => button.textContent?.includes("删除"))!;
    deleteButton.click();
    await tick();
    await tick();

    expect(document.querySelector(".elf-dialog-mask")?.textContent).toContain("确认删除");
    const confirmButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>("elf-button")
    ).find((button) => button.textContent?.includes("确认删除"))!;
    confirmButton.click();
    await tick();
    await tick();
    await tick();
    await tick();

    expect(collectText(table)).not.toContain("支付网关");
    expect(collectText(el)).toContain("已删除：支付网关");
  });

  it("高级案例展示汇总并把单元格事件状态保持在标题区", async () => {
    const el = document.createElement(tableAdvancedTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    expect(collectText(table)).toContain("116 h");

    const projectCell = table.shadowRoot!.querySelectorAll<HTMLTableCellElement>("tbody td")[1]!;
    projectCell.click();
    await tick();

    expect(collectText(el)).toContain("Design Token 语义层升级 · 项目");
    expect(el.shadowRoot!.querySelector('[slot="status"]')).toBeTruthy();
  });

  it("合并单元格案例按日期和班次纵向分组", async () => {
    const el = document.createElement(tableSpanTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const table = el.shadowRoot!.querySelector("elf-table")!;
    const rows = table.shadowRoot!.querySelectorAll<HTMLTableRowElement>("tbody tr");
    expect(rows[0]!.querySelectorAll("td")).toHaveLength(4);
    expect(rows[0]!.querySelector<HTMLTableCellElement>("td")!.rowSpan).toBe(2);
    expect(rows[1]!.querySelectorAll("td")).toHaveLength(2);
    expect(collectText(table)).toContain("7 月 16 日");
  });
});
