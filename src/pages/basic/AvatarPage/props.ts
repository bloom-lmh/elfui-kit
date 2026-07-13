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

const groupPropsRows = [
  { name: "size", type: "sm | md | lg | xl", default: "''" },
  { name: "shape", type: "circle | square", default: "''" },
  { name: "collapse-avatars", type: "boolean", default: "false" },
  { name: "collapse-avatars-tooltip", type: "boolean", default: "false" },
  { name: "max-collapse-avatars", type: "number", default: "3" },
  { name: "effect", type: "light | dark", default: "light" },
  { name: "placement", type: "top | bottom", default: "top" },
  { name: "popper-class", type: "string", default: "''" },
  { name: "popper-style", type: "Record<string, string | number>", default: "{}" },
  { name: "collapse-class", type: "string", default: "''" },
  { name: "collapse-style", type: "Record<string, string | number>", default: "{}" }
];

const PageAvatarProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows} />
  <elf-props-table title="Events" :rows=${eventsRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
  <elf-props-table title="AvatarGroup Props" :rows=${groupPropsRows} />
`);

export { PageAvatarProps };
