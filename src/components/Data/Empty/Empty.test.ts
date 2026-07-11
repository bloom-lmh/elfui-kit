import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerComponents } from "elfui";

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
  });

  it("renders default slot actions", async () => {
    const el = document.createElement("elf-empty");
    el.innerHTML = "<button>Reload</button>";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector("slot:not([name])")).toBeTruthy();
  });
});
