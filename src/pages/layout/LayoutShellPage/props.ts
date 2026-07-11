import { defineHtml, html } from "elfui";

const layoutRows = [
  { name: "<elf-layout> direction", type: "vertical|horizontal", default: "vertical" },
  { name: "<elf-header> height", type: "string", default: "60px" },
  { name: "<elf-aside> width", type: "string", default: "240px" },
  { name: "<elf-main>", type: "—", default: "—", desc: "占据剩余空间" },
  { name: "<elf-footer> height", type: "string", default: "48px" }
];

const PageLayoutShellProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="layoutRows" />
`);

export { PageLayoutShellProps };
