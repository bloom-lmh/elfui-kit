import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Image } from "./index";

beforeAll(() => {
  registerComponents(Image);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ImageEl extends HTMLElement {
  src?: string;
  width?: number;
}

describe("elf-image", () => {
  it("renders image and size", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "x.png";
    el.width = 120;
    document.body.appendChild(el);
    await tick();

    expect((el.shadowRoot!.querySelector("img") as HTMLImageElement).getAttribute("src")).toBe(
      "x.png"
    );
    expect(el.style.getPropertyValue("--_image-width")).toBe("120px");
  });
});
