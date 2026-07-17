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
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

interface AutocompleteEl extends HTMLElement {
  modelValue?: string;
  options?: unknown[];
  fetchSuggestions?: (query: string) => Promise<unknown[]>;
  debounce?: number;
  highlightFirstItem?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  fitInputWidth?: boolean;
  popperOptions?: Record<string, unknown>;
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

  it("keeps a non-teleported panel positioned inside the component", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.teleported = false;
    el.options = [{ value: "Vue" }];
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();

    const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
    expect(panel.getAttribute("popover")).toBeNull();
    expect(panel.classList.contains("is-teleported")).toBe(false);
  });

  it("closes a top-layer panel on external scroll", async () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    const originalHide = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidePopover");
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: showPopover });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", { configurable: true, value: hidePopover });

    try {
      const el = document.createElement("elf-autocomplete") as AutocompleteEl;
      el.options = [{ value: "Vue" }, { value: "React" }];
      el.appendTo = "#overlay-root";
      el.fitInputWidth = true;
      el.popperOptions = {
        modifiers: [
          { name: "offset", options: { offset: [12, 18] } },
          { name: "preventOverflow", options: { padding: 10 } }
        ]
      };
      document.body.appendChild(el);
      await tick();

      const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
      let anchorLeft = 100;
      input.getBoundingClientRect = vi.fn(() => ({
        left: anchorLeft,
        top: 100,
        right: anchorLeft + 240,
        bottom: 134,
        width: 240,
        height: 34,
        x: anchorLeft,
        y: 100,
        toJSON: () => ({})
      })) as unknown as Element["getBoundingClientRect"];
      input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      await tick();

      const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
      panel.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 240,
        bottom: 96,
        width: 240,
        height: 96,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })) as unknown as Element["getBoundingClientRect"];
      window.dispatchEvent(new Event("resize"));
      await frame();
      await tick();

      expect(showPopover).toHaveBeenCalled();
      expect(panel.getAttribute("popover")).toBe("manual");
      expect(panel.dataset.appendTo).toBe("#overlay-root");
      expect(panel.style.position).toBe("fixed");
      expect(panel.style.left).toBe("112px");
      expect(panel.style.top).toBe("152px");
      expect(panel.style.width).toBe("240px");

      panel.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
      await tick();
      expect(input.getAttribute("aria-expanded")).toBe("true");

      window.dispatchEvent(new Event("scroll"));
      await frame();
      await tick();
      expect(input.getAttribute("aria-expanded")).toBe("false");
      expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    } finally {
      if (originalShow) Object.defineProperty(HTMLElement.prototype, "showPopover", originalShow);
      else delete (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover;
      if (originalHide) Object.defineProperty(HTMLElement.prototype, "hidePopover", originalHide);
      else delete (HTMLElement.prototype as HTMLElement & { hidePopover?: () => void }).hidePopover;
    }
  });

  it("reflects the shared field surface contract", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Framework");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Framework");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = document.createElement("elf-autocomplete") as AutocompleteEl;
      el.setAttribute("variant", variant);
      document.body.appendChild(el);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );
});
