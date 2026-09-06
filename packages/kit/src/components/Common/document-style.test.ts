import { afterEach, describe, expect, it } from "vitest";
import { retainDocumentStyle } from "./document-style";

afterEach(() => {
  document
    .querySelectorAll('style[id^="__elfui_global__kit-test-"]')
    .forEach((node) => node.remove());
});

describe("document styles", () => {
  it("shares one style node and removes it after the last user releases it", () => {
    const releaseFirst = retainDocumentStyle("kit-test-overlay", ".overlay { display: block; }");
    const releaseSecond = retainDocumentStyle("kit-test-overlay", ".overlay { display: block; }");
    const selector = "#__elfui_global__kit-test-overlay";

    expect(document.querySelectorAll(selector)).toHaveLength(1);
    expect(document.querySelector(selector)?.textContent).toContain(".overlay");

    releaseFirst();
    expect(document.querySelector(selector)).not.toBeNull();

    releaseSecond();
    releaseSecond();
    expect(document.querySelector(selector)).toBeNull();
  });
});
