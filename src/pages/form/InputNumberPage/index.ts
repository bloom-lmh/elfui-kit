import { defineHtml, html, useComponents } from "elfui";
import { PageInputNumberProps } from "./props";
import { PageInputNumberEx1 } from "./ex1";
import { PageInputNumberEx2 } from "./ex2";
import { PageInputNumberEx3 } from "./ex3";

useComponents({
  "page-input-number-ex1": PageInputNumberEx1,
  "page-input-number-ex2": PageInputNumberEx2,
  "page-input-number-ex3": PageInputNumberEx3,
  "page-input-number-props": PageInputNumberProps
});

const PageInputNumber = defineHtml(html`
  <elf-container>
    <h1>InputNumber 数字输入框</h1>
    <p>用于数值输入，支持最大最小值、步进、精度、严格步进和控制按钮位置。</p>

    <page-input-number-ex1 />

    <page-input-number-ex2 />

    <page-input-number-ex3 />
    <page-input-number-props></page-input-number-props>
  </elf-container>
`);

export { PageInputNumber };
