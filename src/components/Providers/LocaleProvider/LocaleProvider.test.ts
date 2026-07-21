import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { LocaleProviderProbe } from "./probe.test-component";

beforeAll(async () => {
  await import("../../index");
  registerComponents(LocaleProviderProbe);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface LocaleProviderEl extends HTMLElement {
  name?: string;
  rtl?: boolean;
  messages?: Record<string, unknown>;
}

describe("elf-locale-provider", () => {
  it("向子组件提供 locale context", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.rtl = true;
    provider.messages = {
      common: { confirm: "OK" }
    };
    provider.innerHTML = `<elf-locale-provider-probe></elf-locale-provider-probe>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const probe = provider.querySelector("elf-locale-provider-probe")!;
    expect(provider.getAttribute("lang")).toBe("en-US");
    expect(provider.getAttribute("dir")).toBe("rtl");
    expect(probe.shadowRoot?.textContent?.trim()).toBe("en-US|rtl|OK");
  });

  it("英文 locale 使用内置英文文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = `<elf-locale-provider-probe></elf-locale-provider-probe>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const probe = provider.querySelector("elf-locale-provider-probe")!;
    expect(probe.shadowRoot?.textContent?.trim()).toBe("en-US|ltr|Confirm");
  });

  it("为常用表单和数据组件提供英文默认文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = [
      "<elf-select></elf-select>",
      "<elf-date-picker></elf-date-picker>",
      "<elf-tree></elf-tree>",
      "<elf-pagination total=20></elf-pagination>"
    ].join("");

    document.body.appendChild(provider);
    await tick();
    await tick();

    const select = provider.querySelector("elf-select")!;
    const datePicker = provider.querySelector("elf-date-picker")!;
    const tree = provider.querySelector("elf-tree")!;
    const pagination = provider.querySelector("elf-pagination")!;

    expect(select.shadowRoot?.textContent).toContain("Select");
    expect(datePicker.shadowRoot?.textContent).toContain("Select date");
    expect(tree.shadowRoot?.textContent).toContain("No data");
    expect(pagination.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")).toBe(
      "Pagination"
    );
    expect(pagination.shadowRoot?.textContent).toContain("20 items");
  });

  it("显式组件文案优先于 LocaleProvider 默认文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = `<elf-select placeholder="Custom choice"></elf-select>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const select = provider.querySelector("elf-select")!;
    expect(select.shadowRoot?.textContent).toContain("Custom choice");
  });
});
