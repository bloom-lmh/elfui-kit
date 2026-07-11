// elf-alert 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-alert", () => {
  it("基础渲染 title + description", async () => {
    const el = document.createElement("elf-alert");
    el.setAttribute("title", "操作成功");
    el.setAttribute("description", "数据已保存");
    document.body.appendChild(el);
    await tick();
    await tick();

    const text = el.shadowRoot!.textContent ?? "";
    expect(text).toContain("操作成功");
    expect(text).toContain("数据已保存");
  });

  it("type=success 反射到 host", async () => {
    const el = document.createElement("elf-alert");
    el.setAttribute("type", "success");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("type")).toBe("success");
  });

  it("closable 显示关闭按钮，点击 emit close", async () => {
    const el = document.createElement("elf-alert");
    el.setAttribute("closable", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });

    const closeBtn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await tick();
    expect(closed).toBe(true);
  });

  it("show-icon=false 不显示图标", async () => {
    const el = document.createElement("elf-alert") as HTMLElement & { showIcon?: boolean };
    document.body.appendChild(el);
    el.showIcon = false;
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".icon")).toBeNull();
  });
});
