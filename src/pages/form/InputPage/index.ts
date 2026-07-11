import { defineHtml, html, useComponents } from "elfui";
import { PageInputEx1 } from "./ex1";
import { PageInputEx2 } from "./ex2";
import { PageInputEx3 } from "./ex3";
import { PageInputProps } from "./props";

useComponents({
  "page-input-ex1": PageInputEx1,
  "page-input-ex2": PageInputEx2,
  "page-input-ex3": PageInputEx3,
  "page-input-props": PageInputProps
});

const PageInput = defineHtml(html`
  <elf-container>
    <h1>Input 输入框</h1>
    <page-input-ex1 />
    <page-input-ex2 />
    <page-input-ex3 />
    <page-input-props />
  </elf-container>
`);

export { PageInput };
