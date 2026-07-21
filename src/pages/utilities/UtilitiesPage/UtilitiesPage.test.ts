import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageUtilities } = await import("./index");
  pageTag = ensureCustomElement(PageUtilities);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("UtilitiesPage", () => {
  it("在一个页面渲染全部工具类交互面板", async () => {
    const page = await mount();
    const root = page.shadowRoot!;

    expect(root.querySelectorAll(".utility-lab")).toHaveLength(14);
    expect(root.querySelectorAll(".lab-workspace")).toHaveLength(14);
    expect(root.querySelectorAll("elf-playground")).toHaveLength(14);
    expect(root.textContent).toContain("样式和动画");
    expect(root.querySelector(".page-description")).toBeNull();
    expect(root.querySelector(".utility-toolbar")).toBeNull();
    expect(root.querySelector(".lab-description")).toBeNull();
    expect(root.querySelector(".lab-note")).toBeNull();

    const playground = root.querySelector<HTMLElement>("#utility-borders elf-playground")!;
    expect(playground.shadowRoot?.querySelector(".source-toolbar")).toBeTruthy();
    expect(playground.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(root.querySelector<HTMLElement>("#utility-typography elf-playground")?.shadowRoot?.textContent)
      .toContain("Text and typography 文本和排版");
  });

  it("使用下拉单选切换分类和工具类并同步预览代码", async () => {
    const page = await mount();
    const root = page.shadowRoot!;
    const borders = root.querySelector<HTMLElement>("#utility-borders")!;
    const selects = borders.querySelectorAll<HTMLElement>("elf-select");

    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();
    expect(borders.querySelector(".preview-object")?.classList.contains("border-t")).toBe(true);
    const playground = borders.querySelector<HTMLElement>("elf-playground")!;
    expect(playground.shadowRoot?.textContent).toContain('class="border-t"');

    selects[1]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "border-e-lg" }));
    await tick();
    expect(borders.querySelector(".preview-object")?.classList.contains("border-e-lg")).toBe(true);
    expect(borders.querySelector(".preview-object")?.classList.contains("border-t")).toBe(false);
    expect(playground.shadowRoot?.textContent).toContain("border-e-lg");
  });

  it("复用标准 Playground 复制源码并从右侧面板重置", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const page = await mount();
    const root = page.shadowRoot!;
    const borders = root.querySelector<HTMLElement>("#utility-borders")!;
    const selects = borders.querySelectorAll<HTMLElement>("elf-select");
    selects[0]!.dispatchEvent(new CustomEvent("update:modelValue", { detail: "1" }));
    await tick();

    const playground = borders.querySelector<HTMLElement>("elf-playground")!;
    playground.shadowRoot!.querySelector<HTMLButtonElement>(".copy")!.click();
    await tick();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("border-t"));

    borders.querySelector<HTMLElement>(".config-actions elf-button")!.click();
    await tick();
    expect(borders.querySelector(".preview-object")?.classList.contains("border")).toBe(true);
  });
});
