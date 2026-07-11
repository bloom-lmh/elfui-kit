import { PageBacktopEx1 } from "./ex1";
import { PageBacktopEx2 } from "./ex2";
import { PageBacktopProps } from "./props";

import { defineHtml, html, useComponents } from "elfui";

useComponents({
  "page-backtop-ex1": PageBacktopEx1,
  "page-backtop-ex2": PageBacktopEx2,
  "page-backtop-props": PageBacktopProps
});

const PageBacktop = defineHtml(html`
  <elf-container>
    <h1>BackTop</h1>
    <p>
      BackTop listens to a scroll target and shows a floating action button after the configured
      threshold. It can scroll a container or the window back to the top.
    </p>
    <page-backtop-ex1></page-backtop-ex1>
    <page-backtop-ex2></page-backtop-ex2>
    <page-backtop-props></page-backtop-props>
  </elf-container>
`);

export { PageBacktop };
