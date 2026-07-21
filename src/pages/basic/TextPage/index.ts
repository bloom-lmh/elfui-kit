import { defineHtml, html, useComponents } from "@elfui/core";

import { PageTextEx1 } from "./ex1";
import { PageTextEx2 } from "./ex2";
import { PageTextEx3 } from "./ex3";
import { PageTextEx4 } from "./ex4";
import { PageTextEx5 } from "./ex5";

const propsRows = [
  { name: "type", type: "primary|success|warning|danger|info", default: "''" },
  { name: "size", type: "small|default|large|sm|md|lg", default: "''" },
  { name: "truncated", type: "boolean", default: "false" },
  { name: "line-clamp", type: "number", default: "undefined" },
  { name: "tag", type: "TextTag", default: "span" },
  { name: "mark", type: "boolean", default: "false" },
  { name: "deleted", type: "boolean", default: "false" },
  { name: "inserted", type: "boolean", default: "false" },
  { name: "strong", type: "boolean", default: "false" },
  { name: "italic", type: "boolean", default: "false" }
];

useComponents({
  "page-text-ex1": PageTextEx1,
  "page-text-ex2": PageTextEx2,
  "page-text-ex3": PageTextEx3,
  "page-text-ex4": PageTextEx4,
  "page-text-ex5": PageTextEx5
});

const PageText = defineHtml(html`
  <elf-container>
    <h1>Text 文本</h1>
    <p>用于语义文本、尺寸和文本装饰，支持单行截断、多行截断和 tag 渲染。</p>

    <page-text-ex1 />

    <page-text-ex2 />

    <page-text-ex3 />

    <page-text-ex4 />

    <page-text-ex5 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows} />
    <elf-props-table title="Slots" :rows=${[{ name: "default", desc: "文本、图标或其他行内内容" }]} />
  </elf-container>
`);

export { PageText };
