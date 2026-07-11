import { registerComponents } from "elfui";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Text } from "./index";

beforeAll(() => {
  registerComponents(Text);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface TextEl extends HTMLElement {
  type?: string;
  truncated?: boolean;
}

describe("elf-text", () => {
  it("reflects type and clamp state", async () => {
    const el = document.createElement("elf-text") as TextEl;
    el.textContent = "Hello";
    el.type = "success";
    el.setAttribute("line-clamp", "2");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("type")).toBe("success");
    expect(el.hasAttribute("line-clamp")).toBe(true);
    expect(el.style.getPropertyValue("--_line-clamp")).toBe("2");
  });
});
