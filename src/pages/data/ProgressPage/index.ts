import { PageProgressEx1 } from "./ex1";
import { PageProgressEx2 } from "./ex2";
import { PageProgressProps } from "./props";

import { defineHtml, html, useComponents } from "elfui";

useComponents({
  "page-progress-ex1": PageProgressEx1,
  "page-progress-ex2": PageProgressEx2,
  "page-progress-props": PageProgressProps
});

const PageProgress = defineHtml(html`
  <elf-container>
    <h1>Progress 进度条</h1>
    <p>用于展示任务完成度，支持条形、环形、状态色、条纹和不确定进度。</p>
    <page-progress-ex1></page-progress-ex1>
    <page-progress-ex2></page-progress-ex2>
    <page-progress-props></page-progress-props>
  </elf-container>
`);

export { PageProgress };
