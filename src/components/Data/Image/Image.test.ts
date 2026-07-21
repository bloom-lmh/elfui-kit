import { readFileSync } from "node:fs";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Image } from "./index";

beforeAll(() => {
  registerComponents(Image);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ImageEl extends HTMLElement {
  src?: string;
  width?: number;
  height?: number | string;
  fit?: string;
  lazy?: boolean;
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

  it("normalizes numeric size attributes to CSS pixel values", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.setAttribute("src", "x.png");
    el.setAttribute("width", "420");
    el.setAttribute("height", "220");
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_image-width")).toBe("420px");
    expect(el.style.getPropertyValue("--_image-height")).toBe("220px");
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

  it("updates fixed dimensions and fit after mount", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "sample.png";
    document.body.appendChild(el);
    await tick();

    el.width = 320;
    el.height = "180px";
    el.fit = "contain";
    await tick();

    expect(el.style.getPropertyValue("--_image-width")).toBe("320px");
    expect(el.style.getPropertyValue("--_image-height")).toBe("180px");
    expect(el.style.getPropertyValue("--_image-fit")).toBe("contain");
    expect(el.shadowRoot!.querySelector("img")?.classList.contains("fit-contain")).toBe(true);
  });

  it("defers src until the lazy image intersects", async () => {
    let notify: IntersectionObserverCallback = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    class FakeIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "120px 0px";
      readonly thresholds = [0];
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = (): IntersectionObserverEntry[] => [];
    }
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const el = document.createElement("elf-image") as ImageEl;
    el.src = "lazy.png";
    el.lazy = true;
    document.body.appendChild(el);
    await tick();

    expect(observe).toHaveBeenCalledWith(el);
    expect(el.shadowRoot!.querySelector("img")).toBeNull();
    expect(el.shadowRoot!.querySelector(".pending")).toBeTruthy();

    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("lazy.png");
    expect(image.classList.contains("is-loaded")).toBe(false);
    expect(el.shadowRoot!.querySelector(".pending")).toBeTruthy();
    image.dispatchEvent(new Event("load"));
    await tick();
    expect(image.classList.contains("is-loaded")).toBe(true);
    expect(el.shadowRoot!.querySelector(".pending")).toBeNull();
    expect(disconnect).toHaveBeenCalled();
  });

  it("provides a shimmer, success fade, and reduced-motion fallback", () => {
    const cssText = readFileSync("src/components/Data/Image/style.scss", "utf8");
    expect(cssText).toContain("img.is-loaded { opacity: 1; }");
    expect(cssText).toContain("animation: image-pending");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssText).toContain(".pending-indicator { animation: none; }");
  });

  it("allows the lazy-loading indicator to be replaced through the loading slot", async () => {
    class HiddenIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = (): IntersectionObserverEntry[] => [];
    }
    vi.stubGlobal("IntersectionObserver", HiddenIntersectionObserver);

    const el = document.createElement("elf-image") as ImageEl;
    el.src = "lazy.png";
    el.lazy = true;
    const custom = document.createElement("span");
    custom.slot = "loading";
    custom.className = "custom-loading";
    custom.textContent = "Loading illustration";
    el.appendChild(custom);
    document.body.appendChild(el);
    await tick();

    expect(el.querySelector(".custom-loading")).toBe(custom);
    const slot = el.shadowRoot!.querySelector('slot[name="loading"]') as HTMLSlotElement;
    expect(slot.assignedElements()).toEqual([custom]);
  });

  it("emits semantic load and error events", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "sample.png";
    const onLoad = vi.fn();
    const onError = vi.fn();
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    image.dispatchEvent(new Event("load"));
    image.dispatchEvent(new Event("error"));
    await tick();

    expect(onLoad).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledOnce();
    expect(el.shadowRoot!.querySelector(".error")).toBeTruthy();
  });

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
