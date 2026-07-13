import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const mount = async (attributes: Record<string, string> = {}): Promise<HTMLElement> => {
  const el = document.createElement("elf-divider");
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-divider", () => {
  it.each(["solid", "dashed", "dotted", "double"])("supports the %s border style", async (borderStyle) => {
    const el = await mount({ "border-style": borderStyle });

    expect(el.getAttribute("border-style")).toBe(borderStyle);
    expect(el.shadowRoot!.querySelectorAll(".line")).toHaveLength(2);
  });

  it("falls back to a solid border style for invalid input", async () => {
    const el = await mount({ "border-style": "groove" });

    expect(el.getAttribute("border-style")).toBe("solid");
  });

  it("keeps dashed as a backwards-compatible alias", async () => {
    const el = await mount({ dashed: "" });

    expect(el.getAttribute("border-style")).toBe("dashed");
  });

  it("renders content in the default slot", async () => {
    const el = await mount();
    el.textContent = "OR";
    await tick();

    expect(el.shadowRoot!.querySelector("slot")?.assignedNodes()[0]?.textContent).toBe("OR");
  });

  it("supports a vertical divider", async () => {
    const el = await mount({ direction: "vertical", "border-style": "dotted" });

    expect(el.getAttribute("direction")).toBe("vertical");
    expect(el.getAttribute("border-style")).toBe("dotted");
  });
});
