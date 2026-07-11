// elf-props-table 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
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

  it("rows 写入后渲染", async () => {
    const el = document.createElement("elf-props-table") as HTMLElement & { rows?: unknown };
    document.body.appendChild(el);
    el.rows = [{ name: "size", type: "string", default: "md", desc: "尺寸" }];
    await tick();
    await tick();
    await tick();

    const html = el.shadowRoot!.innerHTML;
    expect(html).toContain("size");
  });
});
