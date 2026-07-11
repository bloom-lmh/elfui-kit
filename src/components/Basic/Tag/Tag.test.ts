// elf-tag 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-tag", () => {
  it("默认渲染 slot 内容", async () => {
    const el = document.createElement("elf-tag");
    el.textContent = "标签";
    document.body.appendChild(el);
    await tick();
    expect(el.textContent).toContain("标签");
  });

  it("closable 显示关闭按钮，点击 emit close", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("closable", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    const closeBtn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    closeBtn.click();
    await tick();
    expect(closed).toBe(true);
  });

  it("disabled 不渲染关闭按钮", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("closable", "");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".close")).toBeNull();
  });

  it("color attribute 反射", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("color", "danger");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("color")).toBe("danger");
  });
});
