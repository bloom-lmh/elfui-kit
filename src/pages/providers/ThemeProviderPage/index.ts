import { defineHtml, html, useComponents } from "elfui";

import { PageThemeProviderEx1 } from "./ex1";
import { PageThemeProviderEx2 } from "./ex2";

const propsRows = [
  {
    name: "theme",
    type: "light | dark | custom",
    default: "light",
    desc: "内置主题或自定义主题"
  },
  {
    name: "primary / secondary / surface",
    type: "string",
    default: "",
    desc: "常用 token 快捷覆盖"
  },
  { name: "tokens", type: "ThemeTokens", default: "{}", desc: "完整局部 CSS 变量覆盖" }
];

useComponents({
  "page-theme-provider-ex1": PageThemeProviderEx1,
  "page-theme-provider-ex2": PageThemeProviderEx2
});

const PageThemeProvider = defineHtml(html`
  <elf-container>
    <h1>ThemeProvider 主题提供器</h1>
    <p>通过局部 CSS variables 覆盖一段子树的 Material Design token，不会修改全站主题。</p>

    <page-theme-provider-ex1 />

    <page-theme-provider-ex2 />

    <h2>API</h2>
    <elf-props-table title="ThemeProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageThemeProvider };
