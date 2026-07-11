// elf-grid + elf-grid-item 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-grid", () => {
  it("columns 反映到 css var", async () => {
    const el = document.createElement("elf-grid");
    el.setAttribute("columns", "8");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_cols")).toBe("8");
  });

  it("columns 默认 12", async () => {
    const el = document.createElement("elf-grid");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_cols")).toBe("12");
  });
});

describe("elf-grid-item", () => {
  it("span 反映到 css var", async () => {
    const el = document.createElement("elf-grid-item");
    el.setAttribute("span", "6");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_span")).toBe("6");
  });
});
