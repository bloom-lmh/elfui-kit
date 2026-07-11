// elf-flex 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-flex", () => {
  it("默认 shadowRoot 内只有 slot", async () => {
    const el = document.createElement("elf-flex");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("属性反射到 host", async () => {
    const el = document.createElement("elf-flex");
    el.setAttribute("direction", "column");
    el.setAttribute("gap", "md");
    el.setAttribute("justify", "center");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("direction")).toBe("column");
    expect(el.getAttribute("gap")).toBe("md");
    expect(el.getAttribute("justify")).toBe("center");
  });

  it("样式注入到 shadowRoot", async () => {
    const el = document.createElement("elf-flex");
    document.body.appendChild(el);
    await tick();
    // jsdom 对 adoptedStyleSheets 支持有限；走 <style> fallback
    const sheets = el.shadowRoot!.adoptedStyleSheets;
    const adopted = (sheets && sheets.length) || 0;
    const styleTags = el.shadowRoot!.querySelectorAll("style").length;
    expect(adopted + styleTags).toBeGreaterThan(0);
  });
});
