// elf-card 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-card", () => {
  it("渲染默认卡片", async () => {
    const el = document.createElement("elf-card");
    el.textContent = "内容";
    document.body.appendChild(el);
    await tick();

    // 默认值不反映为 attribute，但 shadow 中有 .body
    expect(el.shadowRoot!.querySelector(".body")).toBeTruthy();
    expect(el.textContent).toContain("内容");
  });

  it("title + subtitle prop 渲染标题和副标题", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("title", "标题");
    el.setAttribute("subtitle", "副标题");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".title")!.textContent).toContain("标题");
    expect(el.shadowRoot!.querySelector(".subtitle")!.textContent).toBe("副标题");
  });

  it("supports Element Plus-compatible header, footer, classes, and body style props", async () => {
    const el = document.createElement("elf-card") as HTMLElement & {
      bodyStyle?: Record<string, string>;
    };
    el.setAttribute("header", "标题");
    el.setAttribute("footer", "页脚");
    el.setAttribute("header-class", "custom-header");
    el.setAttribute("body-class", "custom-body");
    el.setAttribute("footer-class", "custom-footer");
    el.bodyStyle = { color: "rgb(1, 2, 3)" };
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!;
    expect(root.querySelector(".header")?.textContent).toContain("标题");
    expect(root.querySelector(".footer")?.textContent).toContain("页脚");
    expect(root.querySelector(".header")?.classList.contains("custom-header")).toBe(true);
    expect(root.querySelector(".body")?.classList.contains("custom-body")).toBe(true);
    expect(root.querySelector(".footer")?.classList.contains("custom-footer")).toBe(true);
    expect(root.querySelector(".body")?.getAttribute("style")).toContain("color");
  });

  it.each(["always", "hover", "never"])("supports the %s shadow mode", async (shadow) => {
    const el = document.createElement("elf-card");
    el.setAttribute("shadow", shadow);
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("shadow")).toBe(shadow);
  });

  it.each(["elevated", "outlined", "filled", "tonal", "flat"])(
    "supports the %s surface variant",
    async (variant) => {
      const el = document.createElement("elf-card");
      el.setAttribute("variant", variant);
      document.body.appendChild(el);
      await tick();

      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it.each(["default", "comfortable", "compact"])("supports %s density", async (density) => {
    const el = document.createElement("elf-card");
    el.setAttribute("density", density);
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("density")).toBe(density);
  });

  it("makes clickable cards keyboard accessible", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await tick();

    const content = el.shadowRoot!.querySelector(".card-content")!;
    let count = 0;
    el.addEventListener("click", () => count++);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    content.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(content.getAttribute("role")).toBe("button");
    expect(content.getAttribute("tabindex")).toBe("0");
    expect(count).toBe(2);
  });

  it("image prop 渲染封面图", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    document.body.appendChild(el);
    await tick();

    const img = el.shadowRoot!.querySelector(".card-image-wrap img") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain("test.jpg");
  });

  it("overlay 渲染叠加文字", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    el.setAttribute("overlay", "推荐");
    document.body.appendChild(el);
    await tick();

    const overlay = el.shadowRoot!.querySelector(".image-overlay")!;
    expect(overlay.textContent).toBe("推荐");
  });

  it("avatar 渲染头像", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("avatar", "avatar.jpg");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".avatar")).toBeTruthy();
  });

  it("horizontal 布局 image-placement=left", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    el.setAttribute("image-placement", "left");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("image-placement")).toBe("left");
  });

  it("footer slot 渲染", async () => {
    const el = document.createElement("elf-card");
    el.innerHTML = `<template #footer><button>确认</button></template>`;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".footer")).toBeTruthy();
  });

  it("cover 插槽接受没有文本内容的图片元素", async () => {
    const el = document.createElement("elf-card");
    const image = document.createElement("img");
    image.slot = "cover";
    image.src = "cover.jpg";
    image.alt = "封面";
    el.appendChild(image);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.hasAttribute("has-cover")).toBe(true);
    expect(el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="cover"]')?.assignedElements())
      .toContain(image);
  });
});
