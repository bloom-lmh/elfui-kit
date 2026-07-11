import { defineHtml, html, useComponents } from "elfui";
import { PageMenuEx1 } from "./ex1";
import { PageMenuEx2 } from "./ex2";
import { PageMenuEx3 } from "./ex3";
import { PageMenuEx4 } from "./ex4";
import { PageMenuEx5 } from "./ex5";
import { PageMenuEx6 } from "./ex6";
import { PageMenuEx7 } from "./ex7";
import { PageMenuProps } from "./props";

useComponents({
  "page-menu-ex1": PageMenuEx1,
  "page-menu-ex2": PageMenuEx2,
  "page-menu-ex3": PageMenuEx3,
  "page-menu-ex4": PageMenuEx4,
  "page-menu-ex5": PageMenuEx5,
  "page-menu-ex6": PageMenuEx6,
  "page-menu-ex7": PageMenuEx7,
  "page-menu-props": PageMenuProps
});

const PageMenu = defineHtml(html`
  <elf-container>
    <h1>Menu 导航菜单</h1>
    <p>
      用于侧边栏、顶部导航和多级功能入口，对标 Element Plus Menu，视觉采用 Material Design 风格。
    </p>
    <page-menu-ex1></page-menu-ex1>
    <page-menu-ex2></page-menu-ex2>
    <page-menu-ex3></page-menu-ex3>
    <page-menu-ex4></page-menu-ex4>
    <page-menu-ex5></page-menu-ex5>
    <page-menu-ex6></page-menu-ex6>
    <page-menu-ex7></page-menu-ex7>
    <page-menu-props></page-menu-props>
  </elf-container>
`);

export { PageMenu };
