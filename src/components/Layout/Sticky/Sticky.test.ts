import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StickyEl extends HTMLElement {
  offset?: number | string;
  position?: "top" | "bottom";
  target?: string;
  top?: number | string;
  bottom?: number | string;
  zIndex?: number | string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  disabled?: boolean;
  update(): void;
  updateRoot(): void;
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

  it("supports offset and position aliases with semantic reflection", async () => {
    const el = await mount({ offset: 24, position: "bottom" });

    expect(el.getAttribute("data-position")).toBe("bottom");
    expect(el.style.getPropertyValue("--sticky-offset")).toBe("24px");
    expect(el.style.getPropertyValue("--sticky-bottom")).toBe("24px");
  });

  it("滚动到吸附位置时触发 change", async () => {
    const el = await mount({ top: 8 });
    const onChange = vi.fn();
    const onScroll = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.addEventListener("scroll", onScroll as EventListener);
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
    expect((onScroll.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual({ scrollTop: 0, fixed: true });
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

  it("exposes update methods and resolves a target container", async () => {
    const target = document.createElement("section");
    target.id = "sticky-boundary";
    document.body.appendChild(target);
    const el = await mount({ target: "#sticky-boundary" });

    expect(typeof el.update).toBe("function");
    expect(typeof el.updateRoot).toBe("function");
    expect(() => el.updateRoot()).not.toThrow();
    expect(() => el.update()).not.toThrow();
  });

  it("projects light DOM into appendTo when teleported", async () => {
    const target = document.createElement("div");
    target.id = "sticky-portal";
    document.body.appendChild(target);
    const el = document.createElement("elf-sticky") as StickyEl;
    el.teleported = true;
    el.appendTo = target;
    el.innerHTML = "<button>保存</button>";
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    expect(target.querySelector(".elf-sticky-portal button")?.textContent).toBe("保存");
    expect(el.hasAttribute("data-teleported")).toBe(true);
  });
});
