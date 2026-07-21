import { defineHtml, html, useComponents } from "@elfui/core";
import { PageDrawerEx1 } from "./ex1";
import { PageDrawerEx2 } from "./ex2";
import { PageDrawerProps } from "./props";

useComponents({
  "page-drawer-ex1": PageDrawerEx1,
  "page-drawer-ex2": PageDrawerEx2,
  "page-drawer-props": PageDrawerProps
});

const PageDrawer = defineHtml(html`
  <elf-container
    ><h1>Drawer 抽屉</h1>
    <p>从屏幕边缘滑出的面板。</p>
    <page-drawer-ex1 /><page-drawer-ex2 /><page-drawer-props
  /></elf-container>
`);

export { PageDrawer };
