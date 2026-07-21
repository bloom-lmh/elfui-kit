import { defineHtml, html, useComponents } from "@elfui/core";

import { PageLinkEx1 } from "./ex1";
import { PageLinkEx2 } from "./ex2";
import { PageLinkEx3 } from "./ex3";

const propsRows = [
    { name: "type", type: "default|primary|success|warning|danger|info", default: "default" },
    { name: "underline", type: "boolean", default: "true" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "href", type: "string", default: "''" },
    { name: "target", type: "string", default: "''" },
    { name: "icon", type: "string", default: "''" },
];

const slotsRows = [
    { name: "default", desc: "link content" },
    { name: "icon", desc: "custom icon; has higher priority than icon prop" },
];

useComponents({
  "page-link-ex1": PageLinkEx1,
  "page-link-ex2": PageLinkEx2,
  "page-link-ex3": PageLinkEx3
});

const PageLink = defineHtml(html`
    <elf-container>
        <h1>Link 链接</h1>
        <p>文本链接，支持语义类型、下划线、禁用、href/target 和 icon 插槽。</p>

        <page-link-ex1 />

        <page-link-ex2 />

        <page-link-ex3 />

        <h2>API</h2>
        <elf-props-table title="Props" :rows=${propsRows} />
        <elf-props-table title="Slots" :rows=${slotsRows} />
    </elf-container>
`);

export { PageLink };
