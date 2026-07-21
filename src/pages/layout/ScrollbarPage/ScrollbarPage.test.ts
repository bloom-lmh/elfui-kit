import { afterEach, beforeAll, describe, expect, it } from "vitest";

let commandExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageScrollbarEx3 } = await import("./ex3");
  commandExampleTag = ensureCustomElement(PageScrollbarEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("ScrollbarPage command example", () => {
  it("moves the real scroll wrapper to the bottom and back to the top", async () => {
    const page = document.createElement(commandExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const scrollbar = page.shadowRoot!.querySelector("elf-scrollbar")!;
    const wrap = scrollbar.shadowRoot!.querySelector(".wrap") as HTMLElement;
    Object.defineProperty(wrap, "scrollHeight", { value: 800, configurable: true });
    Object.defineProperty(wrap, "clientHeight", { value: 220, configurable: true });
    Object.defineProperty(wrap, "scrollTop", { value: 0, configurable: true, writable: true });

    const buttons = Array.from(page.shadowRoot!.querySelectorAll("elf-button"));
    buttons.find((button) => button.textContent?.includes("滚到底部"))!.click();
    expect(wrap.scrollTop).toBe(800);

    buttons.find((button) => button.textContent?.includes("回到顶部"))!.click();
    expect(wrap.scrollTop).toBe(0);
  });
});
