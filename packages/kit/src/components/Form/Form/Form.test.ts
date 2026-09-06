import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Form } from "./index";

beforeAll(() => {
  registerComponents(Form);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface FormHost extends HTMLElement {
  requestSubmit(): void;
  reset(): void;
}

const mountForm = async (): Promise<{ host: FormHost; nativeForm: HTMLFormElement }> => {
  const host = document.createElement("elf-form") as FormHost;
  document.body.appendChild(host);
  await tick();

  const nativeForm = host.shadowRoot?.querySelector("form");
  if (!(nativeForm instanceof HTMLFormElement)) {
    throw new Error("elf-form did not render its native form element");
  }
  return { host, nativeForm };
};

describe("elf-form native form commands", () => {
  it("delegates requestSubmit() to the internal native form", async () => {
    const { host, nativeForm } = await mountForm();
    const requestSubmit = vi.spyOn(nativeForm, "requestSubmit");

    host.requestSubmit();

    expect(requestSubmit).toHaveBeenCalledOnce();
  });

  it("delegates reset() to the internal native form", async () => {
    const { host, nativeForm } = await mountForm();
    const reset = vi.spyOn(nativeForm, "reset");

    host.reset();

    expect(reset).toHaveBeenCalledOnce();
  });
});
