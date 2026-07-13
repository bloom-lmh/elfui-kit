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
  fetchSuggestions?: (query: string) => Promise<unknown[]>;
  debounce?: number;
  highlightFirstItem?: boolean;
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

  it("filters local suggestions using the current query", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "r";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(el.shadowRoot!.textContent).toContain("React");
    expect(el.shadowRoot!.textContent).not.toContain("Vue");
    expect(el.shadowRoot!.querySelector(".panel")?.getAttribute("role")).toBe("listbox");
  });

  it("selects the option that is currently rendered after a previous selection", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "Vue";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );
    await tick();

    input.value = "React";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".option")?.textContent).toContain("React");
    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );

    expect((onSelect.mock.calls.at(-1)![0] as CustomEvent).detail.value).toBe("React");
  });

  it("uses keyboard navigation and accessible combobox semantics", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "apple" }, { value: "banana" }];
    el.highlightFirstItem = true;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(onChange).toHaveBeenCalled();
  });

  it("debounces remote suggestions and ignores an older response", async () => {
    let resolveFirst: ((value: unknown[]) => void) | undefined;
    const fetchSuggestions = vi
      .fn()
      .mockImplementationOnce(() => new Promise<unknown[]>((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce([{ value: "new" }]);
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.fetchSuggestions = fetchSuggestions;
    el.debounce = 0;
    document.body.appendChild(el);
    await tick();
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "old";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.value = "new";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    resolveFirst?.([{ value: "old" }]);
    await tick();

    expect(fetchSuggestions).toHaveBeenCalledTimes(2);
    expect(el.shadowRoot!.textContent).toContain("new");
    expect(el.shadowRoot!.textContent).not.toContain("old");
  });
});
