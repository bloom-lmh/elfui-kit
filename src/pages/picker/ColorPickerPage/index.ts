import { defineHtml, html, useComponents } from "elfui";


import { PageColorPickerEx1 } from "./ex1";
import { PageColorPickerEx2 } from "./ex2";

const propsRows = [
  { name: "modelValue", type: "string", default: "#6750a4", desc: "当前颜色" },
  { name: "format", type: "hex | rgb", default: "hex", desc: "输出格式" },
  { name: "presets", type: "Array", default: "[]", desc: "预设色" },
  { name: "showAlpha", type: "boolean", default: "false", desc: "透明度" },
  { name: "clearable", type: "boolean", default: "false", desc: "可清空" }
];

useComponents({
  "page-color-picker-ex1": PageColorPickerEx1,
  "page-color-picker-ex2": PageColorPickerEx2
});

const PageColorPicker = defineHtml(html`
  <elf-container>
    <h1>ColorPicker 颜色选择器</h1>
    <p>支持原生色板、文本输入、透明度、清空和预设色。</p>
    <page-color-picker-ex1 />

    <page-color-picker-ex2 />
    <h2>API</h2>
    <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageColorPicker };
