import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Loading } from "./index";

beforeAll(() => {
  registerComponents(Loading);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface LoadingEl extends HTMLElement {
  text?: string;
}

describe("elf-loading", () => {
  it("renders overlay text", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.text = "Loading";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".overlay")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("Loading");
  });
});
