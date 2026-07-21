import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let galleryTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageLayoutShellEx3 } = await import("./ex3");
  const { PageLayoutShellEx4 } = await import("./ex4");
  exampleTag = ensureCustomElement(PageLayoutShellEx3);
  galleryTag = ensureCustomElement(PageLayoutShellEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("LayoutShellPage examples", () => {
  it("渲染多级工作区和右侧详情栏两个新增组合", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll(".layout-canvas")).toHaveLength(2);
    expect(page.shadowRoot!.querySelector(".rail")).toBeTruthy();
    expect(page.shadowRoot!.querySelector(".details")).toBeTruthy();
    expect(page.shadowRoot!.textContent).toContain("多级应用工作区");
  });

  it("使用九个低圆角虚线预览覆盖非后台产品布局", async () => {
    const page = document.createElement(galleryTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("figure")).toHaveLength(9);
    expect(page.shadowRoot!.querySelectorAll(".preview")).toHaveLength(9);
    expect(page.shadowRoot!.textContent).toContain("收件箱");
    expect(page.shadowRoot!.textContent).toContain("商店布局");
  });
});
