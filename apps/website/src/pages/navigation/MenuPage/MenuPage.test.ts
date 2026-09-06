import { registerAllComponents } from "@elfui/kit";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

interface PropsTableElement extends HTMLElement {
  rows?: Array<{ name: string; desc?: string }>;
}

let pageTag = "";
let propsTag = "";

beforeAll(async () => {
  document.documentElement.lang = "en-US";
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [pageModule, propsModule] = await Promise.all([import("./index"), import("./props")]);
  pageTag = ensureCustomElement(pageModule.PageMenu);
  propsTag = ensureCustomElement(propsModule.PageMenuProps);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const mount = async (tag: string): Promise<HTMLElement> => {
  const element = document.createElement(tag);
  document.body.appendChild(element);
  await wait();
  await wait();
  return element;
};

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (!element.shadowRoot) continue;
    const nested = deepQuery<T>(element.shadowRoot, selector);
    if (nested) return nested;
  }
  return null;
};

describe("Menu documentation", () => {
  it("renders all examples and documents Router navigation behavior", async () => {
    const page = await mount(pageTag);
    expect(deepQuery(page.shadowRoot!, "h1")?.textContent).toBe("Menu");
    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-menu-ex1, elf-page-menu-ex2, elf-page-menu-ex3, elf-page-menu-ex4, elf-page-menu-ex5, elf-page-menu-ex6, elf-page-menu-ex7, elf-page-menu-ex8",
      ),
    ).toHaveLength(8);

    const propsPage = await mount(propsTag);
    const tables = propsPage.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");
    expect(tables).toHaveLength(7);
    const routerRow = tables?.[0]?.rows?.find((row) => row.name === "router");
    expect(routerRow?.desc).toContain("active ElfUI Router");
  });
});
