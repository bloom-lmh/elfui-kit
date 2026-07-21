import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageCardEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PageCardEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("CardPage travel card", () => {
  it("使用 SVG 操作图标并同步收藏状态", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const button = page.shadowRoot!.querySelector<HTMLButtonElement>(".favorite")!;
    expect(page.shadowRoot!.querySelectorAll("svg")).toHaveLength(2);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    button.click();
    await tick();
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });
});
