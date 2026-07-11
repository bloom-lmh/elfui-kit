import { afterEach, beforeAll, describe, expect, it } from "vitest";

let breadcrumbExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("elfui");
  const { PageBreadcrumbEx2 } = await import("./ex2");
  breadcrumbExampleTag = ensureCustomElement(PageBreadcrumbEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let text = "";

  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }

    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };

  visit(root);
  return text;
};

describe("BreadcrumbPage", () => {
  it("自定义字段示例会按 maxItems 折叠", async () => {
    const el = document.createElement(breadcrumbExampleTag);
    document.body.appendChild(el);
    await tick();
    await tick();

    const text = collectText(el);
    expect(text).toContain("组件");
    expect(text).toContain("...");
    expect(text).toContain("API");
    expect(text).not.toContain("Navigation");
  });
});
