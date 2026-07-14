import { defineHtml, html, useComponents } from "elfui";
import { PageFlexEx1 } from "./ex1";
import { PageFlexEx2 } from "./ex2";
import { PageFlexEx3 } from "./ex3";
import { PageFlexProps } from "./props";

useComponents({
  "page-flex-ex1": PageFlexEx1,
  "page-flex-ex2": PageFlexEx2,
  "page-flex-ex3": PageFlexEx3,
  "page-flex-props": PageFlexProps
});

const PageFlex = defineHtml(html`
  <elf-container
    ><h1>Flex 弹性布局</h1>
    <page-flex-ex1 /><page-flex-ex2 /><page-flex-ex3 /><page-flex-props
  /></elf-container>
`);

export { PageFlex };
