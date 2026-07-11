import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Mention } from "./index";

beforeAll(() => {
  registerComponents(Mention);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface MentionEl extends HTMLElement {
  modelValue?: string;
  options?: unknown[];
}

describe("elf-mention", () => {
  it("shows options after prefix and emits select", async () => {
    const el = document.createElement("elf-mention") as MentionEl;
    el.modelValue = "@";
    el.options = [{ value: "alice" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    textarea.value = "@a";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );
    expect(onSelect).toHaveBeenCalled();
  });
});
