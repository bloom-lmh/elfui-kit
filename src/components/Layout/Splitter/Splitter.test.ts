import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Splitter } from "./index";

beforeAll(() => {
  registerComponents(Splitter);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface SplitterEl extends HTMLElement {
  modelValue?: number;
}

describe("elf-splitter", () => {
  it("sets first pane size from modelValue", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    el.modelValue = 35;
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_splitter-size")).toBe("35%");
  });

  it("emits resize-start on drag", async () => {
    const el = document.createElement("elf-splitter") as SplitterEl;
    const onStart = vi.fn();
    el.addEventListener("resize-start", onStart as EventListener);
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".bar") as HTMLElement).dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    );

    expect(onStart).toHaveBeenCalled();
  });
});
