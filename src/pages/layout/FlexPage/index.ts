import { defineHtml, html, useComponents } from "elfui";
import { PageFlexEx1 } from "./ex1";
import { PageFlexEx2 } from "./ex2";
import { PageFlexEx3 } from "./ex3";
import { PageFlexEx4 } from "./ex4";
import { PageFlexProps } from "./props";

useComponents({
  "page-flex-ex1": PageFlexEx1,
  "page-flex-ex2": PageFlexEx2,
  "page-flex-ex3": PageFlexEx3,
  "page-flex-ex4": PageFlexEx4,
  "page-flex-props": PageFlexProps
});

const PageFlex = defineHtml(html`
  <elf-container
    ><h1>Flex 弹性布局</h1>
    <p>用于一维方向、对齐、换行和自适应空间分配；案例从基础属性延伸到完整工作台。</p>
    <page-flex-ex1 /><page-flex-ex2 /><page-flex-ex3 /><page-flex-ex4 /><page-flex-props
  /></elf-container>
`);

export { PageFlex };
