import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "elfui";

import { Link } from "./index";

beforeAll(() => {
  registerComponents(Link);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface LinkEl extends HTMLElement {
  type?: string;
  href?: string;
  disabled?: boolean;
}

const mount = async (patch: Partial<LinkEl> = {}): Promise<LinkEl> => {
  const el = document.createElement("elf-link") as LinkEl;
  el.textContent = "Docs";
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-link", () => {
  it("renders href and type", async () => {
    const el = await mount({ type: "primary", href: "/docs" });
    const anchor = el.shadowRoot!.querySelector("a")!;

    expect(el.getAttribute("type")).toBe("primary");
    expect(anchor.getAttribute("href")).toBe("/docs");
    expect(anchor.getAttribute("part")).toBe("link");
  });

  it("prevents click when disabled", async () => {
    const el = await mount({ disabled: true, href: "/docs" });
    const onClick = vi.fn();
    el.addEventListener("click", onClick);

    el.shadowRoot!.querySelector("a")!.click();

    expect(onClick).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector("a")!.getAttribute("href")).toBeNull();
  });
});
