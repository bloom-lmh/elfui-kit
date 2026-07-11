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
});
