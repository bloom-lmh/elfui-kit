// elf-transfer 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

let transferExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageTransferEx1 } = await import("../../../pages/data/TransferPage/ex1");
  transferExampleTag = ensureCustomElement(PageTransferEx1);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

const sampleData = [
  { key: "1", label: "选项 1" },
  { key: "2", label: "选项 2" },
  { key: "3", label: "选项 3" },
  { key: "4", label: "选项 4" }
];

describe("elf-transfer", () => {
  it("渲染左右面板和按钮", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".panel-left")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".panel-right")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".buttons")).toBeTruthy();
  });

  it("无数据时展示空状态", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = [];
    document.body.appendChild(el);
    await tick();

    const empties = el.shadowRoot!.querySelectorAll(".panel-empty");
    expect(empties.length).toBe(2);
  });

  it("初始数据全部在左侧", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    document.body.appendChild(el);
    await tick();

    const leftItems = el.shadowRoot!.querySelectorAll(".panel-left .panel-item");
    const rightItems = el.shadowRoot!.querySelectorAll(".panel-right .panel-item");
    expect(leftItems.length).toBe(4);
    expect(rightItems.length).toBe(0);
  });

  it("有 modelValue 时右侧显示选中项", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    (el as any).modelValue = ["1", "3"];
    document.body.appendChild(el);
    await tick();

    const leftItems = el.shadowRoot!.querySelectorAll(".panel-left .panel-item");
    const rightItems = el.shadowRoot!.querySelectorAll(".panel-right .panel-item");
    expect(leftItems.length).toBe(2);
    expect(rightItems.length).toBe(2);
  });

  it("显示标题", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    (el as any).titles = ["可选", "已选"];
    document.body.appendChild(el);
    await tick();

    const headers = el.shadowRoot!.querySelectorAll(".panel-header span");
    const texts = Array.from(headers).map((s) => s.textContent?.trim());
    expect(texts).toContain("可选");
    expect(texts).toContain("已选");
  });

  it("点击 → 按钮触发 update:modelValue", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    document.body.appendChild(el);
    await tick();

    // 点击左侧第一个复选框
    const leftCheckbox = el.shadowRoot!.querySelector(
      ".panel-left .panel-item input[type='checkbox']"
    ) as HTMLInputElement;
    leftCheckbox.click();
    await tick();

    let emitted: string[] = [];
    el.addEventListener("update:modelValue", ((e: CustomEvent) => {
      emitted = e.detail;
    }) as EventListener);

    // 点击 → 按钮
    const toRightBtn = el.shadowRoot!.querySelector(
      ".buttons button:first-child"
    ) as HTMLButtonElement;
    toRightBtn.click();
    await tick();

    expect(emitted).toContain("1");
  });

  it("受控回写后支持从右侧移回左侧", async () => {
    const el = document.createElement("elf-transfer");
    (el as any).data = sampleData;
    (el as any).modelValue = ["1", "3"];
    el.addEventListener("update:modelValue", ((e: CustomEvent) => {
      (el as any).modelValue = e.detail;
    }) as EventListener);
    document.body.appendChild(el);
    await tick();

    const rightCheckbox = el.shadowRoot!.querySelector(
      ".panel-right .panel-item input[type='checkbox']"
    ) as HTMLInputElement;
    rightCheckbox.click();
    await tick();

    const toLeftBtn = el.shadowRoot!.querySelector(
      ".buttons button:nth-child(2)"
    ) as HTMLButtonElement;
    expect(toLeftBtn.disabled).toBe(false);
    toLeftBtn.click();
    await tick();

    const leftText = el.shadowRoot!.querySelector(".panel-left")?.textContent ?? "";
    const rightText = el.shadowRoot!.querySelector(".panel-right")?.textContent ?? "";
    expect((el as any).modelValue).toEqual(["3"]);
    expect(leftText).toContain("选项 1");
    expect(rightText).not.toContain("选项 1");
  });

  it("页面示例中支持完整左右移动", async () => {
    const page = document.createElement(transferExampleTag);
    document.body.appendChild(page);
    await tick();

    const transfer = page.shadowRoot!.querySelector("elf-transfer") as HTMLElement;
    const root = transfer.shadowRoot!;
    const leftCheckbox = root.querySelector(
      ".panel-left .panel-item input[type='checkbox']"
    ) as HTMLInputElement;
    leftCheckbox.click();
    await tick();

    const toRightBtn = root.querySelector(".buttons button:first-child") as HTMLButtonElement;
    expect(toRightBtn.disabled).toBe(false);
    toRightBtn.click();
    await tick();

    expect(root.querySelector(".panel-right")?.textContent ?? "").toContain("选项 1");

    const rightCheckbox = root.querySelector(
      ".panel-right .panel-item input[type='checkbox']"
    ) as HTMLInputElement;
    rightCheckbox.click();
    await tick();

    const toLeftBtn = root.querySelector(".buttons button:nth-child(2)") as HTMLButtonElement;
    expect(toLeftBtn.disabled).toBe(false);
    toLeftBtn.click();
    await tick();

    expect(root.querySelector(".panel-left")?.textContent ?? "").toContain("选项 1");
    expect(root.querySelector(".panel-right")?.textContent ?? "").not.toContain("选项 1");
  });
});
