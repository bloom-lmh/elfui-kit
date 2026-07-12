import { defineHtml, html } from "elfui";

const propsRows = [
  { name: "size", type: "sm | md | lg | xl", default: "md" },
  { name: "shape", type: "circle | square", default: "circle" },
  { name: "src", type: "string", default: "''" },
  { name: "src-set", type: "string", default: "''" },
  { name: "alt", type: "string", default: "''" },
  { name: "fit", type: "fill|contain|cover|none|scale-down", default: "cover" },
  { name: "icon", type: "string", default: "''" },
  { name: "color", type: "string", default: "''" }
];

const eventsRows = [{ name: "error", type: "(event: Event) => void", desc: "image load failed" }];

const slotsRows = [
  { name: "default", desc: "fallback content" },
  { name: "icon", desc: "custom icon content" }
];

const PageAvatarProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageAvatarProps };
