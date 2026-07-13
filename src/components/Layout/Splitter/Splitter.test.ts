import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Splitter } from "./index";

beforeAll(() => {
  registerComponents(Splitter);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface SplitterEl extends HTMLElement {
  modelValue?: number;
  min?: number;
  max?: number;
  vertical?: boolean;
  disabled?: boolean;
}

describe("elf-splitter", () => {
  it("sets host CSS variable from modelValue", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 35;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("35%");
  });

  it("modelValue = 0 is not treated as falsy", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.min = 0;
    el.modelValue = 0;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("0%");
  });

  it("emits resize-start on pointerdown", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onStart = vi.fn();
    el.addEventListener("resize-start", onStart as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

    expect(onStart).toHaveBeenCalled();
  });

  it("emits update:modelValue on pointermove while dragging", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.releasePointerCapture = vi.fn();

    // Start drag first
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    bar.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, clientX: 200 }));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("stops dragging on pointerup", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onEnd = vi.fn();
    el.addEventListener("resize-end", onEnd as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();
    bar.releasePointerCapture = vi.fn();

    // Start drag
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    // End drag
    bar.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));

    expect(onEnd).toHaveBeenCalled();
    expect(bar.releasePointerCapture).toHaveBeenCalled();
  });

  it("stops dragging on lostpointercapture", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onEnd = vi.fn();
    el.addEventListener("resize-end", onEnd as EventListener);
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.setPointerCapture = vi.fn();

    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    bar.dispatchEvent(new Event("lostpointercapture", { bubbles: true }));

    expect(onEnd).toHaveBeenCalled();
  });

  it("disabled bar ignores pointerdown", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    const onStart = vi.fn();
    el.addEventListener("resize-start", onStart as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

    expect(onStart).not.toHaveBeenCalled();
  });

  it("vertical host attribute reflects", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.vertical = true;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("vertical")).toBe(true);
  });

  it("disabled host flag reflects", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("clamps size to min/max", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.min = 20;
    el.max = 80;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("50%");

    el.modelValue = 5;
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("20%");

    el.modelValue = 95;
    await tick();
    expect(el.style.getPropertyValue("--_splitter-size")).toBe("80%");
  });

  it("keyboard ArrowRight increases size", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("keyboard ArrowLeft decreases size", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 50;
    document.body.appendChild(el);
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const bar = el.shadowRoot!.querySelector(".bar") as HTMLElement;
    bar.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));

    expect(onUpdate).toHaveBeenCalled();
  });

  it("bar has separator role and ARIA attributes", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    document.body.appendChild(el);
    await tick();

    const bar = el.shadowRoot!.querySelector(".bar")!;
    expect(bar.getAttribute("role")).toBe("separator");
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.hasAttribute("tabindex")).toBe(true);
  });
});
