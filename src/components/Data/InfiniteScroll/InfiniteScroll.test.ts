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

    expect(onLoad).toHaveBeenCalled();
  });
});
