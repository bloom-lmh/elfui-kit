// elf-badge 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-badge", () => {
  it("渲染默认状态", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "5");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge).toBeTruthy();
    expect(badge.textContent!.trim()).toBe("5");
  });

  it("value 为字符串时直接渲染文本", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "新");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("新");
  });

  it("数字 value 超出 max 时显示 max+", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "200");
    el.setAttribute("max", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("99+");
  });

  it("数字 value 未超 max 时显示原值", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "42");
    el.setAttribute("max", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge.textContent!.trim()).toBe("42");
  });

  it("isDot 模式下只渲染圆点，不渲染数字", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("is-dot", "");
    el.setAttribute("value", "99");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge")!;
    expect(badge).toBeTruthy();
    expect(badge.querySelector("span")).toBeNull();
  });

  it("hidden 时不渲染 badge", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("hidden", "");
    el.setAttribute("value", "5");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });

  it("value 为 0 时默认显示（showZero=true）", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "0");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeTruthy();
  });

  it("value 为 0 且 showZero=false 时不显示", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "0");
    document.body.appendChild(el);
    // HTML boolean attribute 无法表示 false，需通过 JS property 设置
    (el as any).showZero = false;
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });

  it("自定义 color 覆盖 type 颜色", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    el.setAttribute("color", "#ff6f00");
    document.body.appendChild(el);
    await tick();

    const badge = el.shadowRoot!.querySelector(".badge") as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.style.backgroundColor).toBe("rgb(255, 111, 0)");
  });

  it("默认 slot 内容正常渲染", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "3");
    el.innerHTML = "<span>消息</span>";
    document.body.appendChild(el);
    await tick();

    const wrapper = el.shadowRoot!.querySelector(".badge-wrapper")!;
    expect(wrapper.querySelector("slot")).toBeTruthy();
    expect(el.querySelector("span")?.textContent).toBe("消息");
  });

  it("type 属性反射到 host 上", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    el.setAttribute("type", "success");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("type")).toBe("success");
    expect(el.shadowRoot!.querySelector(".badge")).toBeTruthy();
  });

  it("part 属性可被外部 ::part(badge) 选中", async () => {
    const el = document.createElement("elf-badge");
    el.setAttribute("value", "1");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector("[part='badge']")).toBeTruthy();
  });

  it("value 为空字符串时不渲染", async () => {
    const el = document.createElement("elf-badge");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".badge")).toBeNull();
  });
});
