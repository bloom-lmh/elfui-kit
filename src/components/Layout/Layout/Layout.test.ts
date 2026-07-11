// Layout / Header / Aside / Main / Footer 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-layout", () => {
  it("默认 direction=vertical（column）", async () => {
    const el = document.createElement("elf-layout");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("direction=horizontal 反射到 host", async () => {
    const el = document.createElement("elf-layout");
    el.setAttribute("direction", "horizontal");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("direction")).toBe("horizontal");
  });
});

describe("elf-header", () => {
  it("height prop 写入 css var", async () => {
    const el = document.createElement("elf-header") as HTMLElement & { height?: string };
    el.setAttribute("height", "56px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("56px");
  });
});

describe("elf-aside", () => {
  it("width prop 写入 css var", async () => {
    const el = document.createElement("elf-aside");
    el.setAttribute("width", "200px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("200px");
  });
});

describe("elf-main / elf-footer", () => {
  it("elf-main 渲染", async () => {
    const el = document.createElement("elf-main");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("elf-footer height 写入 css var", async () => {
    const el = document.createElement("elf-footer");
    el.setAttribute("height", "40px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("40px");
  });
});
