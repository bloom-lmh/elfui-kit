import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Collapse } from "./index";
import { CollapseItem } from "../CollapseItem/index";

beforeAll(() => {
  registerComponents(Collapse, CollapseItem);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface CollapseEl extends HTMLElement {
  modelValue?: string | string[];
  accordion?: boolean;
  items?: unknown[];
}

describe("elf-collapse", () => {
  it("renders active panel and emits changes", async () => {
    const el = document.createElement("elf-collapse") as CollapseEl;
    el.modelValue = ["a"];
    el.items = [
      { name: "a", title: "A", content: "Alpha" },
      { name: "b", title: "B", content: "Beta" }
    ];
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".item.is-active")?.textContent).toContain("Alpha");
    (el.shadowRoot!.querySelectorAll(".header")[1] as HTMLButtonElement).click();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["a", "b"]);
  });

  it("supports accordion output", async () => {
    const el = document.createElement("elf-collapse") as CollapseEl;
    el.accordion = true;
    el.items = [{ name: "one", title: "One" }];
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".header") as HTMLButtonElement).click();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("one");
  });

  it("keeps disabled panels closed and exposes button-region relationships", async () => {
    const el = document.createElement("elf-collapse") as CollapseEl;
    el.items = [
      { name: "available", title: "Available", content: "Visible" },
      { name: "locked", title: "Locked", content: "Hidden", disabled: true }
    ];
    document.body.appendChild(el);
    await tick();

    const headers = el.shadowRoot!.querySelectorAll(".header") as NodeListOf<HTMLButtonElement>;
    const disabled = headers[1]!;
    disabled.click();

    expect(disabled.disabled).toBe(true);
    expect(el.shadowRoot!.querySelectorAll(".item.is-active")).toHaveLength(0);
    expect(headers[0]!.getAttribute("aria-controls")).toBeTruthy();
    const region = el.shadowRoot!.querySelector('[role="region"]')!;
    expect(region.getAttribute("aria-labelledby")).toBe(headers[0]!.id);
  });

  it("syncs changes from a controlled model value", async () => {
    const el = document.createElement("elf-collapse") as CollapseEl;
    el.items = [{ name: "a", title: "A", content: "Alpha" }];
    el.modelValue = [];
    document.body.appendChild(el);
    await tick();

    el.modelValue = ["a"];
    await tick();

    expect(el.shadowRoot!.querySelector(".item")?.classList.contains("is-active")).toBe(true);
    expect(el.shadowRoot!.querySelector(".header")?.getAttribute("aria-expanded")).toBe("true");
  });

  it("coordinates slotted collapse items through the same controlled model", async () => {
    const el = document.createElement("elf-collapse") as CollapseEl;
    el.modelValue = ["guide"];
    el.innerHTML = `
      <elf-collapse-item name="guide" title="Guide">Guide content</elf-collapse-item>
      <elf-collapse-item name="api" title="API">API content</elf-collapse-item>
    `;
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    const items = el.querySelectorAll("elf-collapse-item") as NodeListOf<HTMLElement & { active?: boolean }>;
    expect(items[0]!.active).toBe(true);
    expect(items[1]!.active).toBe(false);

    const apiHeader = items[1]!.shadowRoot!.querySelector(".header") as HTMLButtonElement;
    apiHeader.click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["guide", "api"]);
    expect(items[1]!.active).toBe(true);
  });
});
