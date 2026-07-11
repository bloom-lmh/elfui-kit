import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../register");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface RateEl extends HTMLElement {
  modelValue?: number;
  allowHalf?: boolean;
  showScore?: boolean;
}

describe("elf-rate", () => {
  it("点击星星更新评分", async () => {
    const el = document.createElement("elf-rate") as RateEl;
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelectorAll(".star")[3] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(4);
    expect(el.shadowRoot!.querySelectorAll(".star.is-full")).toHaveLength(4);
  });

  it("clearable 支持再次点击清空", async () => {
    const el = document.createElement("elf-rate") as RateEl;
    el.modelValue = 3;
    const onClear = vi.fn();
    el.addEventListener("clear", onClear as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelectorAll(".star")[2] as HTMLElement).click();
    await tick();

    expect(onClear).toHaveBeenCalled();
  });

  it("showScore 展示分数文本", async () => {
    const el = document.createElement("elf-rate") as RateEl;
    el.modelValue = 4.5;
    el.showScore = true;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".text")?.textContent).toContain("4.5");
  });
});
