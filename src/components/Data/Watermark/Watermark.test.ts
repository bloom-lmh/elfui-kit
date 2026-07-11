import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Watermark } from "./index";

beforeAll(() => {
  registerComponents(Watermark);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface WatermarkEl extends HTMLElement {
  content?: string | string[];
  gapX?: number;
}

describe("elf-watermark", () => {
  it("generates svg background from content", async () => {
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "ElfUI";
    el.gapX = 80;
    el.innerHTML = "<p>content</p>";
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_watermark-bg")).toContain("data:image/svg+xml");
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });
});
