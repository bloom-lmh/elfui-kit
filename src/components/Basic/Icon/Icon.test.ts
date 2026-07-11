import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Icon } from "./index";

beforeAll(() => {
  registerComponents(Icon);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface IconEl extends HTMLElement {
  name?: string;
  size?: number | string;
  color?: string;
}

describe("elf-icon", () => {
  it("renders named icon text with size and color", async () => {
    const el = document.createElement("elf-icon") as IconEl;
    el.name = "A";
    el.size = 24;
    el.color = "red";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("A");
    expect(el.style.getPropertyValue("--_icon-size")).toBe("24px");
    expect(el.style.getPropertyValue("--_icon-color")).toBe("red");
  });
});
