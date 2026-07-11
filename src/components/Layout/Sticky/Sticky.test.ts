import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StickyEl extends HTMLElement {
  top?: number | string;
  bottom?: number | string;
  zIndex?: number | string;
  disabled?: boolean;
}

const mount = async (patch: Partial<StickyEl> = {}): Promise<StickyEl> => {
  const el = document.createElement("elf-sticky") as StickyEl;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-sticky", () => {
  it("通过 CSS 变量设置吸附偏移和层级", async () => {
    const el = await mount({ top: 12, zIndex: 30 });

    expect(el.style.getPropertyValue("--sticky-top")).toBe("12px");
    expect(el.style.getPropertyValue("--sticky-z-index")).toBe("30");
  });

  it("bottom 模式会反射 data-bottom", async () => {
    const el = await mount({ bottom: 16 });

    expect(el.hasAttribute("data-bottom")).toBe(true);
    expect(el.style.getPropertyValue("--sticky-bottom")).toBe("16px");
  });

  it("滚动到吸附位置时触发 change", async () => {
    const el = await mount({ top: 8 });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.getBoundingClientRect = () =>
      ({
        top: 4,
        right: 100,
        bottom: 44,
        left: 0,
        width: 100,
        height: 40,
        x: 0,
        y: 4,
        toJSON: () => ({})
      }) as DOMRect;

    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(el.hasAttribute("data-stuck")).toBe(true);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("在内部滚动容器中按容器边界判断吸附状态", async () => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "auto";
    document.body.appendChild(wrapper);
    wrapper.getBoundingClientRect = () =>
      ({
        top: 100,
        right: 300,
        bottom: 300,
        left: 0,
        width: 300,
        height: 200,
        x: 0,
        y: 100,
        toJSON: () => ({})
      }) as DOMRect;
    const el = document.createElement("elf-sticky") as StickyEl;
    el.top = 12;
    wrapper.appendChild(el);
    await tick();
    await tick();
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.getBoundingClientRect = () =>
      ({
        top: 108,
        right: 300,
        bottom: 148,
        left: 0,
        width: 300,
        height: 40,
        x: 0,
        y: 108,
        toJSON: () => ({})
      }) as DOMRect;

    wrapper.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(el.hasAttribute("data-stuck")).toBe(true);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });
});
