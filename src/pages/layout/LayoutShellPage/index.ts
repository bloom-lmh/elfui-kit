import { defineHtml, html, useComponents } from "@elfui/core";
import { PageLayoutShellEx1 } from "./ex1";
import { PageLayoutShellEx2 } from "./ex2";
import { PageLayoutShellEx3 } from "./ex3";
import { PageLayoutShellEx4 } from "./ex4";
import { PageLayoutShellProps } from "./props";

useComponents({
  "page-layout-shell-ex1": PageLayoutShellEx1,
  "page-layout-shell-ex2": PageLayoutShellEx2,
  "page-layout-shell-ex3": PageLayoutShellEx3,
  "page-layout-shell-ex4": PageLayoutShellEx4,
  "page-layout-shell-props": PageLayoutShellProps
});

const PageLayoutShell = defineHtml(html`
  <elf-container
    ><h1>Layout 应用骨架</h1>
    <p>Layout / Header / Aside / Main / Footer 可以组合后台、收件箱、社区、商店和内容型产品布局。</p>
    <page-layout-shell-ex1 /><page-layout-shell-ex2 /><page-layout-shell-ex3 /><page-layout-shell-ex4 /><page-layout-shell-props
  /></elf-container>
`);

export { PageLayoutShell };
