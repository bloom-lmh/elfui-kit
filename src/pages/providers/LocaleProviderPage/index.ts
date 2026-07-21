import { defineHtml, html, useComponents } from "elfui";
import { PageLocaleProviderEx1 } from "./ex1";

const propsRows = [
  { name: "name", type: "string", default: "zh-CN", desc: "语言名称，同时反射为 lang" },
  { name: "dir", type: "ltr | rtl", default: "ltr", desc: "文本方向" },
  { name: "rtl", type: "boolean", default: "false", desc: "快捷切换为 rtl" },
  { name: "messages", type: "object", default: "{}", desc: "本地化文案，会与默认文案合并" }
];

useComponents({
  "page-locale-provider-ex1": PageLocaleProviderEx1
});

const PageLocaleProvider = defineHtml(html`
  <elf-container>
    <h1>LocaleProvider 本地化提供器</h1>
    <p>通过 provide/inject 为子树提供语言名称、方向和翻译函数，适合组件库级文案统一。</p>

    <page-locale-provider-ex1 />
    <h2>API</h2>
    <elf-props-table title="LocaleProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageLocaleProvider };
