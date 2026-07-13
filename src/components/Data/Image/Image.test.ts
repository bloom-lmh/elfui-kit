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
  fit?: string;
  previewSrcList?: string[];
  initialIndex?: number;
  previewTeleported?: boolean;
  zoomRate?: number;
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

  it.each(["fill", "contain", "cover", "none", "scale-down"])(
    "applies the %s object-fit mode immediately",
    async (fit) => {
      const el = document.createElement("elf-image") as ImageEl;
      el.src = "sample.png";
      el.fit = fit;
      document.body.appendChild(el);
      await tick();

      expect(el.style.getPropertyValue("--_image-fit")).toBe(fit);
    }
  );

  it("opens a local preview at the requested initial index and supports toolbar controls", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "first.png";
    el.previewSrcList = ["first.png", "second.png", "third.png"];
    el.initialIndex = 1;
    el.zoomRate = 2;
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector("img") as HTMLImageElement).click();
    await tick();

    const preview = el.shadowRoot!.querySelector(".elf-image-preview") as HTMLElement;
    expect(preview).toBeTruthy();
    expect((preview.querySelector(".elf-image-preview__image") as HTMLImageElement).getAttribute("src")).toBe(
      "second.png"
    );
    expect(preview.querySelector(".elf-image-preview__counter")?.textContent).toBe("2 / 3");

    (preview.querySelector('[aria-label="Next image"]') as HTMLButtonElement).click();
    await tick();
    expect((preview.querySelector(".elf-image-preview__image") as HTMLImageElement).getAttribute("src")).toBe(
      "third.png"
    );

    (preview.querySelector('[aria-label="Zoom in"]') as HTMLButtonElement).click();
    await tick();
    expect((preview.querySelector(".elf-image-preview__image") as HTMLElement).style.transform).toBe("scale(2)");

    (preview.querySelector('[aria-label="Reset zoom"]') as HTMLButtonElement).click();
    await tick();
    expect((preview.querySelector(".elf-image-preview__image") as HTMLElement).style.transform).toBe("scale(1)");
  });

  it("teleports the preview to body and closes it on Escape", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "first.png";
    el.previewSrcList = ["first.png"];
    el.previewTeleported = true;
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector("img") as HTMLImageElement).click();
    await tick();
    expect(document.body.querySelector(".elf-image-preview")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".elf-image-preview")).toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick();
    expect(document.body.querySelector(".elf-image-preview")).toBeNull();
  });

  it("resets the error state after src changes", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "broken.png";
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector("img") as HTMLImageElement).dispatchEvent(new Event("error"));
    await tick();
    expect(el.shadowRoot!.querySelector(".error")).toBeTruthy();

    el.src = "recovered.png";
    await tick();
    expect((el.shadowRoot!.querySelector("img") as HTMLImageElement).getAttribute("src")).toBe(
      "recovered.png"
    );
  });
});
