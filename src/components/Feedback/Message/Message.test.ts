// elf-message + ElfMessage() 测试

import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(async () => {
  const { ElfMessage } = await import("../Message/index");
  ElfMessage.closeAll();
  document.body.innerHTML = "";
  delete document.documentElement.dataset.theme;
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

describe("ElfMessage()", () => {
  it("函数式调用：直接传字符串", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage("测试消息");
    await tick();
    await tick();
    const el = document.body.querySelector("elf-message");
    expect(el).toBeTruthy();
    expect(el!.shadowRoot!.textContent).toContain("测试消息");
  });

  it("暗色主题下正文使用主题文字变量", async () => {
    document.documentElement.dataset.theme = "dark";
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "暗色消息", duration: 0 });
    await tick();
    await tick();

    const content = document.body.querySelector("elf-message")!.shadowRoot!.querySelector(".content");
    expect(content).toBeTruthy();
    const cssText = readFileSync("src/components/Feedback/Message/style.scss", "utf8");
    expect(cssText).toContain("var(--elf-text-primary)");
    expect(cssText).toContain("var(--elf-info");
    document.documentElement.dataset.theme = "light";
  });

  it("ElfMessage.success / .danger 设置 type", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage.success("ok");
    ElfMessage.danger("err");
    ElfMessage.error("compat error");
    await tick();
    await tick();
    const els = document.body.querySelectorAll("elf-message");
    expect(els.length).toBe(3);
    expect((els[0] as HTMLElement & { type?: string }).type).toBe("success");
    expect((els[1] as HTMLElement & { type?: string }).type).toBe("danger");
    expect((els[2] as HTMLElement & { type?: string }).type).toBe("danger");
  });

  it("duration=0 时不自动关闭", async () => {
    const { ElfMessage } = await import("../Message/index");
    const handle = ElfMessage({ message: "permanent", duration: 0 });
    await tick();
    await wait(50);
    expect(document.body.querySelectorAll("elf-message").length).toBeGreaterThan(0);
    handle.close();
    await wait(250);
    expect(document.body.querySelectorAll("elf-message").length).toBe(0);
  });

  it("自动关闭", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "auto", duration: 50 });
    await tick();
    expect(document.body.querySelectorAll("elf-message").length).toBeGreaterThan(0);
    await wait(300);
    expect(document.body.querySelectorAll("elf-message").length).toBe(0);
  });

  it("支持 bottom 位置、offset 和 zIndex 配置", async () => {
    const { ElfMessage } = await import("../Message/index");
    ElfMessage({ message: "bottom", duration: 0, position: "bottom", offset: 40, zIndex: 3100 });
    ElfMessage({ message: "second", duration: 0, position: "bottom", offset: 40 });
    await tick();
    await wait(50);

    const els = document.body.querySelectorAll("elf-message");
    expect(els.length).toBe(2);
    expect(els[0]!.getAttribute("position")).toBe("bottom");
    expect((els[0] as HTMLElement).style.getPropertyValue("--_offset")).toBe("40px");
    expect((els[0] as HTMLElement).style.getPropertyValue("--_z-index")).toBe("3100");
    expect(parseInt((els[1] as HTMLElement).style.getPropertyValue("--_offset"))).toBeGreaterThan(
      40
    );
  });

  it("支持点击回调、关闭回调和 customClass", async () => {
    const { ElfMessage } = await import("../Message/index");
    const onClick = vi.fn();
    const onClose = vi.fn();
    ElfMessage({
      message: "clickable",
      duration: 0,
      closable: true,
      customClass: "qa-message",
      onClick,
      onClose
    });
    await tick();
    await tick();

    const el = document.body.querySelector("elf-message") as HTMLElement;
    expect(el.classList.contains("qa-message")).toBe(true);

    (el.shadowRoot!.querySelector(".message") as HTMLElement).click();
    expect(onClick).toHaveBeenCalledTimes(1);

    (el.shadowRoot!.querySelector(".close") as HTMLElement).click();
    await wait(260);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll("elf-message").length).toBe(0);
  });
});
