import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "elfui";

import { InputNumber } from "./index";

beforeAll(() => {
  registerComponents(InputNumber);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface InputNumberEl extends HTMLElement {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
}

const mount = async (patch: Partial<InputNumberEl> = {}): Promise<InputNumberEl> => {
  const el = document.createElement("elf-input-number") as InputNumberEl;
  Object.assign(el, { modelValue: 1, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-input-number", () => {
  it("increments and emits change", async () => {
    const el = await mount({ step: 2 });
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
  });

  it("clamps and applies precision", async () => {
    const el = await mount({ modelValue: 9, max: 10, step: 1.25, precision: 1 });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(10);
    expect((el.shadowRoot!.querySelector("input") as HTMLInputElement).value).toBe("10");
  });

  it("emits null when input is cleared", async () => {
    const el = await mount();
    const onInput = vi.fn();
    el.addEventListener("input", onInput as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect((onInput.mock.calls[0]![0] as CustomEvent).detail).toBeNull();
  });

  it("does not change when disabled", async () => {
    const el = await mount({ disabled: true });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".increase") as HTMLButtonElement).click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
