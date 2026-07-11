import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Statistic } from "./index";

beforeAll(() => {
  registerComponents(Statistic);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StatisticEl extends HTMLElement {
  value?: number;
  precision?: number;
  title?: string;
  suffix?: string;
}

describe("elf-statistic", () => {
  it("formats value with precision", async () => {
    const el = document.createElement("elf-statistic") as StatisticEl;
    el.title = "Revenue";
    el.value = 1234.5;
    el.precision = 2;
    el.suffix = "USD";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Revenue");
    expect(el.shadowRoot!.textContent).toContain("1,234.50");
    expect(el.shadowRoot!.textContent).toContain("USD");
  });
});
