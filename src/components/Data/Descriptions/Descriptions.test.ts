import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Descriptions } from "./index";

beforeAll(() => {
  registerComponents(Descriptions);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DescriptionsEl extends HTMLElement {
  title?: string;
  items?: unknown[];
  column?: number;
  border?: boolean;
}

describe("elf-descriptions", () => {
  it("renders title and items", async () => {
    const el = document.createElement("elf-descriptions") as DescriptionsEl;
    el.title = "Profile";
    el.border = true;
    el.items = [{ label: "Name", value: "Elf" }];
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("border")).toBe("");
    expect(el.shadowRoot!.textContent).toContain("Profile");
    expect(el.shadowRoot!.textContent).toContain("Elf");
  });
});
