import { defineHtml, html, useComponents } from "elfui";

import { PageIconEx1 } from "./ex1";
import { PageIconEx2 } from "./ex2";
import { PageIconEx3 } from "./ex3";
import { PageIconEx4 } from "./ex4";
import { PageIconEx5 } from "./ex5";

const propsRows = [
  { name: "name", type: "string", default: "''" },
  { name: "size", type: "number | string", default: "1em" },
  { name: "color", type: "string", default: "''" },
  { name: "aria-label", type: "string", default: "''" },
  { name: "loading", type: "boolean", default: "false" }
];

const slotsRows = [{ name: "default", desc: "自定义图标内容（文本/SVG/组件）" }];

useComponents({
  "page-icon-ex1": PageIconEx1,
  "page-icon-ex2": PageIconEx2,
  "page-icon-ex3": PageIconEx3,
  "page-icon-ex4": PageIconEx4,
  "page-icon-ex5": PageIconEx5
});

const PageIcon = defineHtml(html`
    <elf-container>
        <h1>Icon 图标</h1>
        <p>轻量图标容器，通过 name 显示文本符号，或默认插槽放入自定义 SVG。</p>

        <page-icon-ex1 />

        <page-icon-ex2 />

        <page-icon-ex3 />

        <page-icon-ex4 />

        <page-icon-ex5 />

        <h2>API</h2>
        <elf-props-table title="Props" :rows=${propsRows} />
        <elf-props-table title="Slots" :rows=${slotsRows} />
    </elf-container>
`);

export { PageIcon };
