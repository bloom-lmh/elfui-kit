import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerComponents } from "@elfui/core";

import { Empty } from "./index";

beforeAll(() => {
  registerComponents(Empty);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface EmptyEl extends HTMLElement {
  description?: string;
  imageSize?: number | string;
}

describe("elf-empty", () => {
  it("renders description and image size", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    el.description = "Nothing here";
    el.imageSize = 120;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Nothing here");
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("120px");
    expect(el.shadowRoot!.querySelector(".illustration")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders default slot actions", async () => {
    const el = document.createElement("elf-empty");
    el.innerHTML = "<button>Reload</button>";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector("slot:not([name])")).toBeTruthy();
  });

  it("forwards image source and accepts a string image size", async () => {
    const el = document.createElement("elf-empty") as EmptyEl & { image?: string };
    el.image = "https://example.com/empty.svg";
    el.imageSize = "96px";
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img")!;
    expect(image.getAttribute("src")).toBe("https://example.com/empty.svg");
    expect(el.shadowRoot!.querySelector(".illustration")).toBeNull();
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("96px");
  });

  it("projects image and description slots", async () => {
    const el = document.createElement("elf-empty");
    el.innerHTML = '<span slot="image">◎</span><strong slot="description">No matches</strong>';
    document.body.appendChild(el);
    await tick();

    const imageSlot = el.shadowRoot!.querySelector('slot[name="image"]') as HTMLSlotElement;
    const descriptionSlot = el.shadowRoot!.querySelector('slot[name="description"]') as HTMLSlotElement;
    expect(imageSlot.assignedNodes()[0]?.textContent).toContain("◎");
    expect(descriptionSlot.assignedNodes()[0]?.textContent).toContain("No matches");
  });
});
