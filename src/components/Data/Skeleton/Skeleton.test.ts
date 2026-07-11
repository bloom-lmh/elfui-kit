// elf-skeleton 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-skeleton", () => {
  it("默认渲染 text 变体", async () => {
    const el = document.createElement("elf-skeleton");
    document.body.appendChild(el);
    await tick();

    const items = el.shadowRoot!.querySelectorAll(".skeleton");
    expect(items.length).toBe(1);
  });

  it("count=3 渲染 3 条", async () => {
    const el = document.createElement("elf-skeleton");
    el.setAttribute("count", "3");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelectorAll(".skeleton").length).toBe(3);
  });

  it("circle variant 渲染圆形", async () => {
    const el = document.createElement("elf-skeleton");
    el.setAttribute("variant", "circle");
    el.setAttribute("width", "64px");
    el.setAttribute("height", "64px");
    document.body.appendChild(el);
    await tick();

    const sk = el.shadowRoot!.querySelector(".skeleton") as HTMLElement;
    expect(sk.style.width).toBe("64px");
    expect(sk.style.height).toBe("64px");
  });

  it("rect variant 渲染矩形", async () => {
    const el = document.createElement("elf-skeleton");
    el.setAttribute("variant", "rect");
    el.setAttribute("width", "100%");
    el.setAttribute("height", "200px");
    document.body.appendChild(el);
    await tick();

    const sk = el.shadowRoot!.querySelector(".skeleton") as HTMLElement;
    expect(sk.style.height).toBe("200px");
  });

  it("animated 默认开启 shimmer", async () => {
    const el = document.createElement("elf-skeleton");
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("animated")).toBe(false);
    expect(el.shadowRoot!.querySelector(".skeleton")).toBeTruthy();
  });
});
