import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-footer", () => {
  it("uses the Element Plus compatible 60px default height", async () => {
    const el = document.createElement("elf-footer");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("60px");
  });

  it("maps height attributes and property updates to the host CSS variable", async () => {
    const el = document.createElement("elf-footer") as HTMLElement & { height: string };
    el.setAttribute("height", "40px");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("40px");

    el.height = "3.5rem";
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("3.5rem");
  });

  it("renders default slot content", async () => {
    const el = document.createElement("elf-footer");
    el.textContent = "© ElfUI";
    document.body.appendChild(el);
    await tick();
    expect(el.textContent).toContain("ElfUI");
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });
});
