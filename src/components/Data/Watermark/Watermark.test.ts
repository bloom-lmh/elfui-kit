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
  font?: { fontSize?: number; color?: string };
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

  it("uses font object values ahead of legacy font props", async () => {
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "ElfUI";
    el.font = { fontSize: 22, color: "#123456" };
    document.body.appendChild(el);
    await tick();

    const background = decodeURIComponent(el.style.getPropertyValue("--_watermark-bg"));
    expect(background).toContain('font-size="22"');
    expect(background).toContain('fill="#123456"');
  });
});
