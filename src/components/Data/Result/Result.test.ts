import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerComponents } from "elfui";

import { Result } from "./index";

beforeAll(() => {
  registerComponents(Result);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ResultEl extends HTMLElement {
  icon?: string;
  title?: string;
  subTitle?: string;
}

describe("elf-result", () => {
  it("renders status, title and subtitle", async () => {
    const el = document.createElement("elf-result") as ResultEl;
    el.icon = "success";
    el.title = "Saved";
    el.subTitle = "Your changes are ready";
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("icon")).toBe("success");
    expect(el.shadowRoot!.textContent).toContain("Saved");
    expect(el.shadowRoot!.textContent).toContain("Your changes are ready");
  });
});
