import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../index");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ThemeProviderEl extends HTMLElement {
  theme?: string;
  primary?: string;
  surface?: string;
}

describe("elf-theme-provider", () => {
  it("把主题 token 写成局部 CSS 变量", async () => {
    const provider = document.createElement("elf-theme-provider") as ThemeProviderEl;
    provider.theme = "dark";
    provider.primary = "#006a6a";
    provider.surface = "#102020";

    document.body.appendChild(provider);
    await tick();
    await tick();

    expect(provider.getAttribute("data-theme")).toBe("dark");
    expect(provider.style.getPropertyValue("--elf-primary")).toBe("#006a6a");
    expect(provider.style.getPropertyValue("--elf-bg-paper")).toBe("#102020");
    expect(provider.style.getPropertyValue("--elf-text-primary")).toContain("255");
  });

  it("custom 主题只写入覆盖 token", async () => {
    const provider = document.createElement("elf-theme-provider") as ThemeProviderEl;
    provider.theme = "custom";
    provider.primary = "#6750a4";

    document.body.appendChild(provider);
    await tick();

    expect(provider.style.getPropertyValue("--elf-primary")).toBe("#6750a4");
    expect(provider.style.getPropertyValue("--elf-bg-default")).toBe("");
  });
});
