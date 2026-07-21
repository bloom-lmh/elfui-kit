import { defineDirective, defineHtml, html } from "@elfui/core";

export const localDualCalls: string[] = [];

defineDirective("dual", {
  mounted: () => localDualCalls.push("local")
});

const TestDualDirective = defineHtml(html`<button v-dual>x</button>`);

export { TestDualDirective };
