import { readFileSync } from "node:fs";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Descriptions } from "./index";
import { DescriptionsItem } from "../DescriptionsItem/index";

beforeAll(() => {
  registerComponents(Descriptions, DescriptionsItem);
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
  direction?: string;
  size?: string;
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

  it("renders declarative descriptions items instead of the data fallback", async () => {
    const el = document.createElement("elf-descriptions") as DescriptionsEl;
    el.direction = "horizontal";
    el.size = "lg";
    el.items = [{ label: "Fallback", value: "must not render" }];
    el.innerHTML = `
      <elf-descriptions-item label="Name" span="2" label-width="100">
        <strong>Elf</strong>
      </elf-descriptions-item>
      <elf-descriptions-item>
        <span slot="label">Role</span>
        Maintainer
      </elf-descriptions-item>
    `;
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.textContent).not.toContain("must not render");
    const children = el.querySelectorAll("elf-descriptions-item");
    expect(children).toHaveLength(2);
    expect(children[0]!.getAttribute("data-direction")).toBe("horizontal");
    expect(children[0]!.getAttribute("data-size")).toBe("lg");
    expect(children[0]!.style.getPropertyValue("--_descriptions-item-span")).toBe("2");
    expect(children[0]!.shadowRoot!.textContent).toContain("Name");
    expect(children[0]!.textContent).toContain("Elf");
    expect(children[1]!.shadowRoot!.querySelector('slot[name="label"]')).toBeTruthy();
  });

  it("uses a shared horizontal label track and a mobile single-column fallback", () => {
    const cssText = readFileSync("src/components/Data/Descriptions/style.scss", "utf8");
    expect(cssText).toContain("grid-template-columns: 88px minmax(0, 1fr)");
    expect(cssText).toContain("@media (max-width: 640px)");
    expect(cssText).toContain("grid-column: 1 / -1 !important");
  });
});
