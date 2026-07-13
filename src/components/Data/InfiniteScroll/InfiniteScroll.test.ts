import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { InfiniteScroll } from "./index";

beforeAll(() => {
  registerComponents(InfiniteScroll);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-infinite-scroll", () => {
  it("emits load when close to bottom", async () => {
    const el = document.createElement("elf-infinite-scroll");
    const onLoad = vi.fn();
    el.addEventListener("load", onLoad as EventListener);
    document.body.appendChild(el);
    await tick();
    const scroller = el.shadowRoot!.querySelector(".scroll") as HTMLElement;
    Object.defineProperty(scroller, "scrollHeight", { value: 100, configurable: true });
    Object.defineProperty(scroller, "clientHeight", { value: 50, configurable: true });
    Object.defineProperty(scroller, "scrollTop", { value: 50, configurable: true });

    scroller.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => setTimeout(resolve, 220));

    expect(onLoad).toHaveBeenCalled();
  });

  it("creates a bounded internal viewport by default", async () => {
    const el = document.createElement("elf-infinite-scroll");
    document.body.appendChild(el);
    await tick();

    expect((el.shadowRoot!.querySelector(".scroll") as HTMLElement).style.height).toBe("280px");
  });

  it("uses the configured external container and coalesces delayed loads", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    Object.defineProperties(container, {
      scrollHeight: { value: 100, configurable: true },
      clientHeight: { value: 50, configurable: true },
      scrollTop: { value: 50, configurable: true }
    });
    const el = document.createElement("elf-infinite-scroll") as HTMLElement & { container?: HTMLElement; delay?: number };
    el.container = container;
    el.delay = 15;
    const onLoad = vi.fn();
    el.addEventListener("load", onLoad as EventListener);
    document.body.appendChild(el);
    await tick();
    container.dispatchEvent(new Event("scroll"));
    container.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});
