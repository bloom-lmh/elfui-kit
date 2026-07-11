import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ColorPickerEl extends HTMLElement {
  modelValue?: string;
  presets?: unknown[];
}

describe("elf-color-picker", () => {
  it("选择预设色触发更新", async () => {
    const el = document.createElement("elf-color-picker") as ColorPickerEl;
    el.presets = ["#ff0000", "#00ff00"];
    document.body.appendChild(el);
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".preset") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("#ff0000");
  });
});
