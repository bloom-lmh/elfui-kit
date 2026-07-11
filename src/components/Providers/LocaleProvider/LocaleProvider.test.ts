import { compile } from "@elfui/compiler";
import { setTemplateCompiler, type RenderFn } from "@elfui/chain";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { defineComponent, inject } from "elfui";
import { DEFAULT_LOCALE_CONTEXT, LOCALE_PROVIDER_KEY } from "../context";

beforeAll(async () => {
  setTemplateCompiler((template) => compile(template) as unknown as RenderFn);
  await import("../../index");
  if (!customElements.get("elf-locale-provider-probe")) {
    defineComponent({
      name: "elf-locale-provider-probe",
      setup: () => {
        const locale =
          inject(LOCALE_PROVIDER_KEY, DEFAULT_LOCALE_CONTEXT) ?? DEFAULT_LOCALE_CONTEXT;
        return { locale };
      },
      template: `<span class="value">{{ locale.name }}|{{ locale.dir }}|{{ locale.t('common.confirm') }}</span>`
    });
  }
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
});
