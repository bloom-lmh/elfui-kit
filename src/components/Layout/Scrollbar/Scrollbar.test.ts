import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Scrollbar } from "./index";

beforeAll(() => {
  registerComponents(Scrollbar);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ScrollbarEl extends HTMLElement {
  height?: number;
}

describe("elf-scrollbar", () => {
  it("emits scroll detail", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    el.height = 120;
    const onScroll = vi.fn();
    el.addEventListener("scroll", onScroll as EventListener);
    document.body.appendChild(el);
    await tick();
    const wrap = el.shadowRoot!.querySelector(".wrap") as HTMLElement;
    Object.defineProperty(wrap, "scrollTop", { value: 12, configurable: true });

    wrap.dispatchEvent(new Event("scroll"));

    expect(el.style.getPropertyValue("--_scrollbar-height")).toBe("120px");
    expect((onScroll.mock.calls[0]![0] as CustomEvent).detail.scrollTop).toBe(12);
  });
});
