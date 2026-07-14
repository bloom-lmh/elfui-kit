import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { InfiniteScroll } from "./index";
import { infiniteScrollDirective } from "./directive";
import type { InfiniteScrollDirectiveValue } from "./types";

beforeAll(() => {
  registerComponents(InfiniteScroll);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const binding = (value: InfiniteScrollDirectiveValue, oldValue?: InfiniteScrollDirectiveValue) => ({
  value,
  oldValue,
  modifiers: {}
});

const directiveHooks = infiniteScrollDirective as {
  mounted: (el: HTMLElement, binding: ReturnType<typeof binding>) => void;
  updated: (el: HTMLElement, binding: ReturnType<typeof binding>) => void;
  beforeUnmount: (el: HTMLElement, binding: ReturnType<typeof binding>) => void;
};

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

  it("respects disabled and loading before emitting load", async () => {
    const container = document.createElement("div");
    Object.defineProperties(container, {
      scrollHeight: { value: 100, configurable: true },
      clientHeight: { value: 50, configurable: true },
      scrollTop: { value: 50, configurable: true }
    });
    document.body.appendChild(container);
    const el = document.createElement("elf-infinite-scroll") as HTMLElement & {
      container: HTMLElement;
      delay: number;
      disabled: boolean;
      loading: boolean;
    };
    el.container = container;
    el.delay = 0;
    el.disabled = true;
    const onLoad = vi.fn();
    el.addEventListener("load", onLoad as EventListener);
    document.body.appendChild(el);
    await tick();

    container.dispatchEvent(new Event("scroll"));
    el.disabled = false;
    el.loading = true;
    container.dispatchEvent(new Event("scroll"));
    el.loading = false;
    container.dispatchEvent(new Event("scroll"));
    await tick();

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("immediate only loads when the target is within the threshold", async () => {
    const container = document.createElement("div");
    Object.defineProperties(container, {
      scrollHeight: { value: 80, configurable: true },
      clientHeight: { value: 80, configurable: true },
      scrollTop: { value: 0, configurable: true }
    });
    document.body.appendChild(container);
    const el = document.createElement("elf-infinite-scroll") as HTMLElement & {
      container: HTMLElement;
      delay: number;
      immediate: boolean;
    };
    el.container = container;
    el.delay = 0;
    el.immediate = true;
    const onLoad = vi.fn();
    el.addEventListener("load", onLoad as EventListener);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it("cancels a pending component load on unmount", async () => {
    const container = document.createElement("div");
    Object.defineProperties(container, {
      scrollHeight: { value: 100, configurable: true },
      clientHeight: { value: 50, configurable: true },
      scrollTop: { value: 50, configurable: true }
    });
    document.body.appendChild(container);
    const el = document.createElement("elf-infinite-scroll") as HTMLElement & {
      container: HTMLElement;
      delay: number;
    };
    el.container = container;
    el.delay = 20;
    const onLoad = vi.fn();
    el.addEventListener("load", onLoad as EventListener);
    document.body.appendChild(el);
    await tick();
    container.dispatchEvent(new Event("scroll"));
    el.remove();
    await new Promise((resolve) => setTimeout(resolve, 35));

    expect(onLoad).not.toHaveBeenCalled();
  });

  it("v-infinite-scroll reads Element Plus compatible attributes", async () => {
    const el = document.createElement("div");
    el.setAttribute("infinite-scroll-immediate", "false");
    el.setAttribute("infinite-scroll-distance", "20");
    el.setAttribute("infinite-scroll-delay", "10");
    Object.defineProperties(el, {
      scrollHeight: { value: 100, configurable: true },
      clientHeight: { value: 50, configurable: true },
      scrollTop: { value: 35, configurable: true }
    });
    const handler = vi.fn();
    const current = binding(handler);
    directiveHooks.mounted(el, current);
    el.dispatchEvent(new Event("scroll"));
    el.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(handler).toHaveBeenCalledTimes(1);
    directiveHooks.beforeUnmount(el, current);
  });

  it("v-infinite-scroll supports immediate, disabled updates, and cleanup", async () => {
    const el = document.createElement("div");
    Object.defineProperties(el, {
      scrollHeight: { value: 0, configurable: true },
      clientHeight: { value: 0, configurable: true },
      scrollTop: { value: 0, configurable: true }
    });
    const handler = vi.fn();
    const active = binding({ handler, immediate: true, delay: 0 });
    directiveHooks.mounted(el, active);
    await tick();
    expect(handler).toHaveBeenCalledTimes(1);

    const disabled = binding({ handler, immediate: false, delay: 0, disabled: true }, active.value);
    directiveHooks.updated(el, disabled);
    el.dispatchEvent(new Event("scroll"));
    expect(handler).toHaveBeenCalledTimes(1);

    directiveHooks.beforeUnmount(el, disabled);
    el.dispatchEvent(new Event("scroll"));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
