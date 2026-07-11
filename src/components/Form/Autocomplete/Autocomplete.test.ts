import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Autocomplete } from "./index";

beforeAll(() => {
  registerComponents(Autocomplete);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AutocompleteEl extends HTMLElement {
  modelValue?: string;
  options?: unknown[];
}

describe("elf-autocomplete", () => {
  it("filters and selects options", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "apple" }, { value: "banana" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "app";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );
    expect(onSelect).toHaveBeenCalled();
  });
});
