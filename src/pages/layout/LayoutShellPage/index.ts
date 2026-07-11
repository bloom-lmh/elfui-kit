import { defineHtml, html, useComponents } from "elfui";
import { PageLayoutShellEx1 } from "./ex1";
import { PageLayoutShellEx2 } from "./ex2";
import { PageLayoutShellProps } from "./props";

useComponents({
  "page-layout-shell-ex1": PageLayoutShellEx1,
  "page-layout-shell-ex2": PageLayoutShellEx2,
  "page-layout-shell-props": PageLayoutShellProps
});

const PageLayoutShell = defineHtml(html`
  <elf-container
    ><h1>Layout 应用骨架</h1>
    <p>5 件套 flex 容器：Layout / Header / Aside / Main / Footer。组合即可拼出常见后台布局。</p>
    <page-layout-shell-ex1 /><page-layout-shell-ex2 /><page-layout-shell-props
  /></elf-container>
`);

export { PageLayoutShell };
