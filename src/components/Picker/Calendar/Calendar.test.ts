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
  modelValue?: string;
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
    (el.shadowRoot!.querySelector(".day") as HTMLButtonElement).click();
    expect(onChange).toHaveBeenCalled();
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
    expect(header.textContent).toContain("2026-07");
    (el.shadowRoot!.querySelectorAll(".nav")[1] as HTMLButtonElement).click();
    await tick();
    expect(header.textContent).toContain("2026-08");
  });
});
