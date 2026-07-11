// elf-container 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-container", () => {
  it("渲染 slot 内容", async () => {
    const el = document.createElement("elf-container");
    el.innerHTML = "<p>子内容</p>";
    document.body.appendChild(el);
    await tick();
    expect(el.querySelector("p")?.textContent).toBe("子内容");
  });

  it("max-width 属性反射", async () => {
    const el = document.createElement("elf-container");
    el.setAttribute("max-width", "md");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("max-width")).toBe("md");
  });

  it("padding 属性反射", async () => {
    const el = document.createElement("elf-container");
    el.setAttribute("padding", "lg");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("padding")).toBe("lg");
  });
});
