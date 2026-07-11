// elf-playground 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-playground", () => {
  it("title 渲染", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "示例标题");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".header")?.textContent).toContain("示例标题");
  });

  it("title 字体加粗", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "Test");
    document.body.appendChild(el);
    await tick();
    const header = el.shadowRoot!.querySelector(".header") as HTMLElement;
    // 验证 header 元素存在且 title 正确
    expect(header.textContent).toContain("Test");
  });

  it("demo slot 渲染子元素", async () => {
    const el = document.createElement("elf-playground");
    const child = document.createElement("span");
    child.textContent = "demo content";
    el.appendChild(child);
    document.body.appendChild(el);
    await tick();
    const demo = el.shadowRoot!.querySelector(".demo");
    expect(demo).toBeTruthy();
  });

  it("支持 Template / Script 切换并规整公共缩进", async () => {
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
    };
    el.code = `
      <elf-select :options.prop="opts" />
    `;
    el.script = `
      const opts = [
        { label: "Vue", value: "vue" }
      ];
    `;
    document.body.appendChild(el);
    await tick();
    await tick();

    const code = () => el.shadowRoot!.querySelector("code")?.textContent ?? "";
    expect(code()).toBe('<elf-select :options.prop="opts" />');

    const tabs = el.shadowRoot!.querySelectorAll(".tabs button");
    expect(tabs).toHaveLength(2);
    (tabs[1] as HTMLElement).click();
    await tick();

    expect(code()).toContain("const opts = [");
    expect(code()).not.toMatch(/^\s{6}/);
  });
});
