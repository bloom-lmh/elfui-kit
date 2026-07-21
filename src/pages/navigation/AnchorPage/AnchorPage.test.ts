import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAnchorEx2 } = await import("./ex2");
  exampleTag = ensureCustomElement(PageAnchorEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("Anchor documentation", () => {
  it("keeps the horizontal navigation synchronized with its scroll container", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const anchor = page.shadowRoot!.querySelector<HTMLElement>('elf-anchor[direction="horizontal"]')!;
    const container = page.shadowRoot!.querySelector<HTMLElement>("#anchor-horizontal-scroll")!;
    container.getBoundingClientRect = vi.fn(() => ({
      top: 0, left: 0, right: 640, bottom: 300, width: 640, height: 300, x: 0, y: 0, toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    const sections = Array.from(container.querySelectorAll<HTMLElement>("section"));
    sections.forEach((section, index) => {
      section.getBoundingClientRect = vi.fn(() => ({
        top: index * 220, left: 0, right: 640, bottom: index * 220 + 220,
        width: 640, height: 220, x: 0, y: index * 220, toJSON: () => ({})
      })) as unknown as Element["getBoundingClientRect"];
    });
    const scrollTo = vi.fn();
    Object.defineProperty(container, "scrollTo", { configurable: true, value: scrollTo });

    const release = anchor.shadowRoot!.querySelector<HTMLAnchorElement>('a[href="#anchor-horizontal-release"]')!;
    release.click();
    await tick();
    await tick();

    expect(scrollTo).toHaveBeenCalledWith({ top: 1320, behavior: "smooth" });
    expect(anchor.shadowRoot!.querySelector(".item.is-active")?.textContent).toMatch(/Release notes|发布说明/);
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("#anchor-horizontal-release");
  });
});
