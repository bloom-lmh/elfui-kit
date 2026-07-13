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

  it("supports formatter and value-style props", async () => {
    const el = document.createElement("elf-statistic") as StatisticEl & {
      formatter?: (value: number) => string;
      valueStyle?: Record<string, string>;
    };
    el.value = 128430;
    el.formatter = (value) => `${Math.round(value / 1000)}k`;
    el.valueStyle = { color: "rgb(1, 2, 3)" };
    document.body.appendChild(el);
    await tick();

    const value = el.shadowRoot!.querySelector(".value") as HTMLElement;
    expect(value.textContent).toContain("128k");
    expect(value.getAttribute("style")).toContain("color");
  });

  it("renders title, prefix, and suffix slots without matching props", async () => {
    const el = document.createElement("elf-statistic");
    el.innerHTML = `
      <strong slot="title">CPU</strong>
      <span slot="prefix">~</span>
      <span slot="suffix">%</span>
    `;
    document.body.appendChild(el);
    await tick();

    for (const name of ["title", "prefix", "suffix"]) {
      const slot = el.shadowRoot!.querySelector(`slot[name="${name}"]`) as HTMLSlotElement;
      expect(slot.assignedNodes().length).toBeGreaterThan(0);
    }
  });
});
