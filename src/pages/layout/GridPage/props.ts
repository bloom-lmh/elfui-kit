import { defineHtml, html } from "elfui";

const gridRows = [
  { name: "columns", type: "number", default: "12", desc: "总列数" },
  { name: "gap", type: "0|xs|sm|md|lg|xl", default: "0" }
];

const itemRows = [{ name: "span", type: "number", default: "1", desc: "占用列数（1 ~ columns）" }];

const PageGridProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="elf-grid Props" :rows="gridRows" /><elf-props-table
    title="elf-grid-item Props"
    :rows="itemRows"
  />
`);

export { PageGridProps };
