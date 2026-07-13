import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { InputTag } from "./index";

beforeAll(() => {
  registerComponents(InputTag);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface InputTagEl extends HTMLElement {
  modelValue?: string[];
  placeholder?: string;
  collapseTags?: boolean;
  maxCollapseTags?: number;
}

const mount = async (patch: Partial<InputTagEl> = {}): Promise<InputTagEl> => {
  const el = document.createElement("elf-input-tag") as InputTagEl;
  Object.assign(el, { modelValue: ["Vue"], ...patch });
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-input-tag", () => {
  it("renders tags", async () => {
    const el = await mount();

    expect(el.shadowRoot!.querySelector(".tag")?.textContent).toContain("Vue");
  });

  it("adds tag on enter", async () => {
    const el = await mount({ modelValue: [] });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "Elf";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Elf"]);
  });

  it("reorders tags through drag and drop when draggable", async () => {
    const el = await mount({ modelValue: ["Vue", "Elf"] } as Partial<InputTagEl>);
    (el as HTMLElement & { draggable?: boolean }).draggable = true;
    await tick();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const tags = el.shadowRoot!.querySelectorAll(".tag");
    tags[0]!.dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    tags[1]!.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true }));

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Elf", "Vue"]);
  });

  it("collapses surplus tags without changing the input's height", async () => {
    const el = await mount({
      modelValue: ["Vue", "React", "Solid"],
      collapseTags: true,
      maxCollapseTags: 1
    });

    expect(el.shadowRoot!.querySelectorAll(".tag")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".overflow-count")?.textContent).toContain("+2");
    expect(el.shadowRoot!.querySelector(".remove svg")).toBeTruthy();
  });

  it("exposes hidden tags and allows deleting one of them", async () => {
    const el = await mount({
      modelValue: ["Vue", "React", "Solid"],
      collapseTags: true,
      maxCollapseTags: 1
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const hidden = el.shadowRoot!.querySelectorAll(".hidden-tag");
    expect(hidden).toHaveLength(2);
    expect(hidden[0]?.textContent).toContain("React");
    (hidden[0]!.querySelector(".remove") as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Vue", "Solid"]);
  });
});
