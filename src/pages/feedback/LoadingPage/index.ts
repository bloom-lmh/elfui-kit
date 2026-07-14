import { defineHtml, html, useComponents } from "elfui";

import { PageLoadingEx1 } from "./ex1";
import { PageLoadingEx2 } from "./ex2";
import { PageLoadingEx3 } from "./ex3";
import { PageLoadingEx4 } from "./ex4";
import { PageLoadingEx5 } from "./ex5";

useComponents({
  "page-loading-ex1": PageLoadingEx1,
  "page-loading-ex2": PageLoadingEx2,
  "page-loading-ex3": PageLoadingEx3,
  "page-loading-ex4": PageLoadingEx4,
  "page-loading-ex5": PageLoadingEx5
});

const PageLoading = defineHtml(html`
  <elf-container>
    <h1>Loading 加载</h1>
    <p>给局部内容或全屏状态添加加载遮罩，支持文案和背景色。</p>

    <page-loading-ex1 />

    <page-loading-ex2 />

    <page-loading-ex3 />

    <page-loading-ex4 />

    <page-loading-ex5 />
  </elf-container>
`);

export { PageLoading };
