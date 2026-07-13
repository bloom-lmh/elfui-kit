import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface PaginationEl extends HTMLElement {
  total?: number;
  currentPage?: number;
  defaultCurrentPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageCount?: number;
  pageSizes?: number[];
  prevText?: string;
  nextText?: string;
  size?: string;
  hideOnSinglePage?: boolean;
}

const mount = async (setup?: (el: PaginationEl) => void): Promise<PaginationEl> => {
  const el = document.createElement("elf-pagination") as PaginationEl;
  el.total = 95;
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-pagination", () => {
  it("渲染总数和页码", async () => {
    const el = await mount();

    expect(el.shadowRoot!.textContent).toContain("共 95 条");
    expect(el.shadowRoot!.querySelectorAll(".page").length).toBeGreaterThan(1);
  });

  it("点击页码触发 currentPage 更新", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:currentPage", onUpdate as EventListener);

    const page1 = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page")).find(
      (button) => button.textContent?.trim() === "1"
    )!;
    const page2 = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page")).find(
      (button) => button.textContent?.trim() === "2"
    )!;
    expect(page1.classList.contains("is-active")).toBe(true);
    page2.click();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
    expect(page1.classList.contains("is-active")).toBe(false);
    expect(page2.classList.contains("is-active")).toBe(true);
    expect(page2.getAttribute("aria-current")).toBe("page");
  });

  it("上一页和下一页可切换页码", async () => {
    const el = await mount((pagination) => {
      pagination.currentPage = 2;
    });
    const onCurrent = vi.fn();
    el.addEventListener("current-change", onCurrent as EventListener);

    const prev = el.shadowRoot!.querySelector(".nav") as HTMLButtonElement;
    prev.click();
    await tick();

    expect((onCurrent.mock.calls[0]![0] as CustomEvent).detail).toBe(1);
  });

  it("修改 pageSize 触发 size-change", async () => {
    const el = await mount((pagination) => {
      pagination.pageSizes = [5, 10, 20];
    });
    const onSize = vi.fn();
    el.addEventListener("size-change", onSize as EventListener);

    const select = el.shadowRoot!.querySelector("select") as HTMLSelectElement;
    select.value = "20";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();

    expect((onSize.mock.calls[0]![0] as CustomEvent).detail).toBe(20);
  });

  it("jumper 支持跳转到指定页", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:currentPage", onUpdate as EventListener);

    const input = el.shadowRoot!.querySelector(".jumper input") as HTMLInputElement;
    input.value = "5";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(5);
  });

  it("hideOnSinglePage 单页时隐藏", async () => {
    const el = await mount((pagination) => {
      pagination.total = 8;
      pagination.hideOnSinglePage = true;
    });

    expect(el.shadowRoot!.querySelector(".pagination")).toBeFalsy();
  });

  it("uses default state only as the uncontrolled initial value", async () => {
    const el = await mount((pagination) => {
      pagination.setAttribute("default-current-page", "3");
      pagination.setAttribute("default-page-size", "20");
    });

    const active = el.shadowRoot!.querySelector<HTMLButtonElement>(".page.is-active")!;
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>("select")!;
    expect(active.textContent?.trim()).toBe("3");
    expect(select.value).toBe("20");

    active.previousElementSibling?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".page.is-active")!.textContent?.trim()).toBe("2");
  });

  it("uses explicit page-count and exposes customized accessible navigation", async () => {
    const el = await mount((pagination) => {
      pagination.total = 0;
      pagination.pageCount = 4;
      pagination.prevText = "Back";
      pagination.nextText = "Forward";
      pagination.size = "large";
    });

    const root = el.shadowRoot!;
    expect(root.querySelectorAll(".page")).toHaveLength(4);
    expect(root.querySelector(".pagination")?.classList.contains("is-large")).toBe(true);
    expect(root.querySelector<HTMLButtonElement>(".arrow-left, .nav")?.getAttribute("aria-label")).toBe("Back");
    expect(root.querySelectorAll<HTMLButtonElement>(".nav")[1].getAttribute("aria-label")).toBe("Forward");
  });
});
