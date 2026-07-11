import { defineHtml, html } from "elfui";

const propsRows = [
  {
    name: "target",
    type: "string | HTMLElement | Window",
    default: "window",
    desc: "scroll target"
  },
  { name: "visibility-height", type: "number", default: "200", desc: "show threshold" },
  { name: "right", type: "string | number", default: "'32px'", desc: "fixed right offset" },
  { name: "bottom", type: "string | number", default: "'32px'", desc: "fixed bottom offset" },
  { name: "z-index", type: "string | number", default: "10", desc: "floating z-index" },
  { name: "smooth", type: "boolean", default: "true", desc: "smooth scroll behavior" },
  { name: "shape", type: "circle | square", default: "circle", desc: "button shape" },
  { name: "size", type: "string | number", default: "'44px'", desc: "button size" },
  { name: "icon", type: "string", default: "'↑'", desc: "fallback icon text" },
  { name: "disabled", type: "boolean", default: "false", desc: "disable and hide button" }
];

const eventsRows = [
  { name: "click", type: "(detail: BackTopClickDetail) => void", desc: "button clicked" },
  { name: "visible-change", type: "(visible: boolean) => void", desc: "visibility changed" }
];

const methodsRows = [{ name: "scrollToTop", type: "() => void", desc: "scroll target to top" }];

const PageBacktopProps = defineHtml(html`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
`);

export { PageBacktopProps };
