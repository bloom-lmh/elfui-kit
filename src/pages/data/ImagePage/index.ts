import { defineHtml, html, useComponents } from "elfui";

import { PageImageEx1 } from "./ex1";
import { PageImageEx2 } from "./ex2";
import { PageImageEx3 } from "./ex3";
import { PageImageEx4 } from "./ex4";

useComponents({
  "page-image-ex1": PageImageEx1,
  "page-image-ex2": PageImageEx2,
  "page-image-ex3": PageImageEx3,
  "page-image-ex4": PageImageEx4
});

const PageImage = defineHtml(html`
  <elf-container>
    <h1>Image 图片</h1>
    <p>展示图片资源，支持尺寸、填充方式、懒加载、错误占位与预览。</p>

    <page-image-ex1 />

    <page-image-ex2 />

    <page-image-ex3 />

    <page-image-ex4 />
  </elf-container>
`);

export { PageImage };
