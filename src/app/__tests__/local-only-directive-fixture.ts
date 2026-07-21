import { defineDirective, defineHtml, html } from "@elfui/core";

export const localOnlyCalls: string[] = [];

defineDirective("local-only", {
  mounted: (element: HTMLElement) => localOnlyCalls.push(element.tagName.toLowerCase())
});

const TestLocalDirective = defineHtml(html`<button v-local-only>x</button>`);

export { TestLocalDirective };
