import { defineHtml, html, useComponents } from "elfui";
import { PageTextareaEx1 } from "./ex1";
import { PageTextareaEx2 } from "./ex2";
import { PageTextareaProps } from "./props";

useComponents({
  "page-textarea-ex1": PageTextareaEx1,
  "page-textarea-ex2": PageTextareaEx2,
  "page-textarea-props": PageTextareaProps
});

const PageTextarea = defineHtml(html`
  <elf-container>
    <h1>Textarea 多行文本</h1>
    <page-textarea-ex1 />
    <page-textarea-ex2 />
    <page-textarea-props />
  </elf-container>
`);

export { PageTextarea };
