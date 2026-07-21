import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMasonry } = await import("./index");
  pageTag = ensureCustomElement(PageMasonry);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("MasonryPage image gallery", () => {
  it("使用七张具有稳定替代文本和不同高度的图片", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const images = page.shadowRoot!.querySelectorAll<HTMLImageElement>(".masonry-card img");
    expect(images).toHaveLength(7);
    expect(Array.from(images).every((image) => Boolean(image.alt))).toBe(true);
    expect(new Set(Array.from(images, (image) => image.style.height)).size).toBeGreaterThan(3);
  });
});
