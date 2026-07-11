import { defineHtml, html, useComponents } from "elfui";
import { PageSelectEx1 } from "./ex1";
import { PageSelectEx2 } from "./ex2";
import { PageSelectEx3 } from "./ex3";
import { PageSelectEx4 } from "./ex4";
import { PageSelectEx5 } from "./props";

useComponents({
  "page-select-ex1": PageSelectEx1,
  "page-select-ex2": PageSelectEx2,
  "page-select-ex3": PageSelectEx3,
  "page-select-ex4": PageSelectEx4,
  "page-select-ex5": PageSelectEx5
});

const PageSelect = defineHtml(html`
  <elf-container>
    <h1>Select 选择器</h1>
    <page-select-ex1 />
    <page-select-ex2 />
    <page-select-ex3 />
    <page-select-ex4 />
    <page-select-ex5 />
  </elf-container>
`);

export { PageSelect };
