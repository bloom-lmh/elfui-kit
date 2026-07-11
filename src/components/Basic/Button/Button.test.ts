// elf-button 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-button", () => {
  it("能渲染并显示 slot 内容", async () => {
    const el = document.createElement("elf-button");
    el.textContent = "保存";
    document.body.appendChild(el);
    await tick();

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn).toBeTruthy();
    expect(el.textContent).toContain("保存");
  });

  it("点击触发 click 事件", async () => {
    const el = document.createElement("elf-button");
    document.body.appendChild(el);
    await tick();

    let count = 0;
    el.addEventListener("click", () => count++);
    el.shadowRoot!.querySelector("button")!.click();
    expect(count).toBe(1);
  });

  it("disabled 时不触发 click", async () => {
    const el = document.createElement("elf-button");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await tick();

    let count = 0;
    el.addEventListener("click", () => count++);
    el.shadowRoot!.querySelector("button")!.click();
    expect(count).toBe(0);
  });

  it("loading 时渲染 spinner 且不触发 click", async () => {
    const el = document.createElement("elf-button");
    el.setAttribute("loading", "");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".spinner")).toBeTruthy();

    let count = 0;
    el.addEventListener("click", () => count++);
    el.shadowRoot!.querySelector("button")!.click();
    expect(count).toBe(0);
  });

  it("variant / color / size attribute 反射到 host", async () => {
    const el = document.createElement("elf-button");
    el.setAttribute("variant", "outlined");
    el.setAttribute("color", "danger");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.getAttribute("color")).toBe("danger");
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("button[type] 透传给原生 button", async () => {
    const el = document.createElement("elf-button");
    el.setAttribute("type", "submit");
    document.body.appendChild(el);
    await tick();

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.type).toBe("submit");
  });

  it("part 属性可被外部 ::part(button) 选中", async () => {
    const el = document.createElement("elf-button");
    document.body.appendChild(el);
    await tick();

    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.getAttribute("part")).toBe("button");
  });
});
