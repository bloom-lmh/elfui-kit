import { defineHtml, html, useComponents } from "@elfui/core";

import { PageDefaultsProviderEx1 } from "./ex1";
import { PageDefaultsProviderEx2 } from "./ex2";

const propsRows = [
  {
    name: "defaults",
    type: "Record<string, object>",
    default: "{}",
    desc: "按组件名匹配默认 props"
  },
  { name: "strategy", type: "missing | overwrite", default: "missing", desc: "默认值写入策略" },
  { name: "deep", type: "boolean", default: "true", desc: "是否递归作用于所有后代" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用默认值下发" }
];

useComponents({
  "page-defaults-provider-ex1": PageDefaultsProviderEx1,
  "page-defaults-provider-ex2": PageDefaultsProviderEx2
});

const PageDefaultsProvider = defineHtml(html`
  <elf-container>
    <h1>DefaultsProvider 默认值提供器</h1>
    <p>为一段组件树批量设置默认 props，适合统一按钮、标签、表单控件的默认尺寸和风格。</p>

    <page-defaults-provider-ex1 />

    <page-defaults-provider-ex2 />

    <h2>API</h2>
    <elf-props-table title="DefaultsProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageDefaultsProvider };
