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
});
