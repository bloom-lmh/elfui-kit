import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Calendar } from "./index";

beforeAll(() => {
  registerComponents(Calendar);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface CalendarEl extends HTMLElement {
  modelValue?: string | string[];
  range?: boolean;
  disabledDate?: (date: Date) => boolean;
  locale?: string;
}

describe("elf-calendar", () => {
  it("renders month grid and emits change", async () => {
    const el = document.createElement("elf-calendar") as CalendarEl;
    el.modelValue = "2026-07-05";
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelectorAll(".day")).toHaveLength(42);
    const selected = el.shadowRoot!.querySelector('[data-date="2026-07-05"]') as HTMLButtonElement;
    expect(selected.classList.contains("is-current")).toBe(true);
    expect(selected.getAttribute("aria-selected")).toBe("true");
    const next = el.shadowRoot!.querySelector('[data-date="2026-07-06"]') as HTMLButtonElement;
    next.click();
    expect(onChange).toHaveBeenCalled();
    await tick();
    const updated = el.shadowRoot!.querySelector('[data-date="2026-07-06"]') as HTMLButtonElement;
    const previous = el.shadowRoot!.querySelector('[data-date="2026-07-05"]') as HTMLButtonElement;
    expect(updated.classList.contains("is-current")).toBe(true);
    expect(previous.classList.contains("is-current")).toBe(false);
  });

  it("supports localized weekday labels, navigation, and disabled dates", async () => {
    const el = document.createElement("elf-calendar") as CalendarEl;
    el.modelValue = "2026-07-05";
    el.locale = "zh-CN";
    el.disabledDate = (date) => date.getDay() === 0;
    document.body.appendChild(el);
    await tick();
    const days = el.shadowRoot!.querySelectorAll(".day") as NodeListOf<HTMLButtonElement>;
    expect(el.shadowRoot!.querySelector(".week")?.textContent).toContain("日");
    expect(Array.from(days).some((day) => day.disabled)).toBe(true);
    const header = el.shadowRoot!.querySelector(".header")!;
    expect(header.textContent).toContain("2026年");
    expect(header.textContent).toContain("7月");
    (el.shadowRoot!.querySelectorAll(".nav")[1] as HTMLButtonElement).click();
    await tick();
    expect(header.textContent).toContain("8月");
  });

  it("通过月份和年份面板切换日期层级", async () => {
    const el = document.createElement("elf-calendar") as CalendarEl;
    el.modelValue = "2026-07-05";
    el.locale = "zh-CN";
    document.body.appendChild(el);
    await tick();

    const periodButtons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".period-button");
    periodButtons[0]!.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".year-grid .choice")).toHaveLength(12);

    const yearButton = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".year-grid .choice")).find(
      (button) => button.textContent?.trim() === "2027"
    )!;
    yearButton.click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".month-grid .choice")).toHaveLength(12);
  });

  it("collects two clicks into a sorted range", async () => {
    const el = document.createElement("elf-calendar") as CalendarEl;
    el.modelValue = "2026-07-05";
    el.range = true;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();
    const end = el.shadowRoot!.querySelector('[data-date="2026-07-12"]') as HTMLButtonElement;
    const start = el.shadowRoot!.querySelector('[data-date="2026-07-08"]') as HTMLButtonElement;
    end.click();
    expect(onChange).not.toHaveBeenCalled();
    start.click();
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual(["2026-07-08", "2026-07-12"]);
  });

  it("clears the committed range preview as soon as a new range starts", async () => {
    const el = document.createElement("elf-calendar") as CalendarEl;
    el.modelValue = ["2026-07-05", "2026-07-12"];
    el.range = true;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector('[data-date="2026-07-20"]') as HTMLButtonElement).click();
    await tick();
    await tick();

    expect(onChange).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector('[data-date="2026-07-20"]')?.classList.contains("is-range-start")).toBe(true);
    expect(el.shadowRoot!.querySelector('[data-date="2026-07-05"]')?.classList.contains("is-range-start")).toBe(false);
    expect(el.shadowRoot!.querySelector('[data-date="2026-07-12"]')?.classList.contains("is-range-end")).toBe(false);
    expect(el.shadowRoot!.querySelectorAll(".is-in-range")).toHaveLength(0);
  });
});
