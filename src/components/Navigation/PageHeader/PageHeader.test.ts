import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { PageHeader } from "./index";

beforeAll(() => {
  registerComponents(PageHeader);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface PageHeaderEl extends HTMLElement {
  title?: string;
  content?: string;
}

describe("elf-page-header", () => {
  it("renders content and emits back", async () => {
    const el = document.createElement("elf-page-header") as PageHeaderEl;
    el.title = "Back";
    el.content = "Detail";
    const onBack = vi.fn();
    el.addEventListener("back", onBack as EventListener);
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Detail");
    (el.shadowRoot!.querySelector(".back") as HTMLButtonElement).click();
    expect(onBack).toHaveBeenCalled();
  });

  it("renders breadcrumb slot", async () => {
    const el = document.createElement("elf-page-header") as PageHeaderEl;
    const breadcrumb = document.createElement("span");
    breadcrumb.slot = "breadcrumb";
    breadcrumb.textContent = "Home / Detail";
    el.appendChild(breadcrumb);
    document.body.appendChild(el);
    await tick();

    const slot = el.shadowRoot!.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
    expect(slot.assignedElements()[0]).toBe(breadcrumb);
  });
});
