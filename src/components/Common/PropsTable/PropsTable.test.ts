// elf-props-table 测试

import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { PropsTable } from "./index";

beforeAll(() => {
  registerComponents(PropsTable);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-props-table", () => {
  it("默认标题为 Props", async () => {
    const el = document.createElement("elf-props-table");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector("h4")?.textContent).toBe("Props");
  });

  it("rows 写入后完整渲染", async () => {
    const el = document.createElement("elf-props-table") as HTMLElement & { rows?: unknown };
    document.body.appendChild(el);
    el.rows = [{ name: "size", type: "string", default: "md", desc: "尺寸" }];
    await tick();
    await tick();
    await tick();

    const cells = Array.from(el.shadowRoot!.querySelectorAll("tbody tr:not(.empty-row) td"), (cell) => cell.textContent);
    expect(cells).toEqual(["size", "string", "md", "尺寸"]);
  });

  it("保留 0 和 false 默认值", async () => {
    const el = document.createElement("elf-props-table") as HTMLElement & { rows?: unknown };
    el.rows = [
      { name: "count", type: "number", default: 0 },
      { name: "disabled", type: "boolean", default: false }
    ];
    document.body.appendChild(el);
    await tick();
    const defaults = Array.from(el.shadowRoot!.querySelectorAll("tbody tr:not(.empty-row) td:nth-child(3)"), (cell) => cell.textContent);
    expect(defaults).toEqual(["0", "false"]);
  });

  it("空数据展示默认或自定义提示", async () => {
    const el = document.createElement("elf-props-table") as HTMLElement & { emptyText?: string };
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".empty-row")?.textContent).toContain("暂无数据");

    el.emptyText = "尚未定义";
    await tick();
    expect(el.shadowRoot!.querySelector(".empty-row")?.textContent).toContain("尚未定义");
  });

  it("empty slot 可覆盖空状态", async () => {
    const el = document.createElement("elf-props-table");
    const empty = document.createElement("span");
    empty.slot = "empty";
    empty.textContent = "自定义空状态";
    el.appendChild(empty);
    document.body.appendChild(el);
    await tick();
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="empty"]');
    expect(slot?.assignedElements()).toEqual([empty]);
  });

  it("表格具有名称和稳定 part", async () => {
    const el = document.createElement("elf-props-table");
    el.setAttribute("title", "Events");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("table")?.getAttribute("aria-label")).toBe("Events");
    expect(el.shadowRoot!.querySelector('[part="table"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('[part="header"]')).toBeTruthy();
  });
});
