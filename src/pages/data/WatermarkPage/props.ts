import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "content", type: "string | string[]", default: "''" },
  { name: "image", type: "string", default: "''" },
  { name: "width / height", type: "number", default: "120 / 64" },
  { name: "rotate", type: "number", default: "-22" },
  { name: "gap-x / gap-y", type: "number", default: "100 / 100" },
  { name: "offset-x / offset-y", type: "number", default: "gap / 2" },
  { name: "font-size / font-color", type: "number / string", default: "16 / rgba(0,0,0,0.15)" },
  { name: "z-index", type: "number", default: "9" }
];

const PageWatermarkProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Slots" :rows=${[{ name: "default", desc: "watermarked content" }]} />
`);

export { PageWatermarkProps };
