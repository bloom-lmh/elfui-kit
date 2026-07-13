import { defineHtml, html } from "elfui";

const descriptionsProps = [
  { name: "title", type: "string", default: "''" },
  { name: "extra", type: "string", default: "''" },
  { name: "items", type: "DescriptionItem[]", default: "[]" },
  { name: "column", type: "number", default: "3" },
  { name: "border", type: "boolean", default: "false" },
  { name: "direction", type: "horizontal | vertical", default: "horizontal" },
  { name: "size", type: "sm | md | lg", default: "''" }
];

const itemProps = [
  { name: "label", type: "string", default: "''" },
  { name: "span", type: "number", default: "1" },
  { name: "align", type: "left | center | right", default: "''" },
  { name: "label-align", type: "left | center | right", default: "''" },
  { name: "label-width", type: "string | number", default: "''" },
  { name: "class-name", type: "string", default: "''" }
];

const itemSlots = [
  { name: "default", desc: "description content" },
  { name: "label", desc: "custom label content" }
];

const PageDescriptionsProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Descriptions Props" :rows=${descriptionsProps} />
  <elf-props-table title="DescriptionsItem Props" :rows=${itemProps} />
  <elf-props-table title="DescriptionsItem Slots" :rows=${itemSlots} />
`);

export { PageDescriptionsProps };
