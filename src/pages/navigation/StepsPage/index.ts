import { defineHtml, html, useComponents } from "elfui";
import { PageStepsEx1 } from "./ex1";
import { PageStepsEx2 } from "./ex2";
import { PageStepsEx3 } from "./ex3";
import { PageStepsProps } from "./props";

useComponents({
  "page-steps-ex1": PageStepsEx1,
  "page-steps-ex2": PageStepsEx2,
  "page-steps-ex3": PageStepsEx3,
  "page-steps-props": PageStepsProps
});

const PageSteps = defineHtml(html`
  <elf-container>
    <h1>Steps 步骤条</h1>
    <p>引导用户按照流程完成任务的分步导航条，支持水平和垂直两种方向。</p>
    <page-steps-ex1 />
    <page-steps-ex2 />
    <page-steps-ex3 />
    <page-steps-props />
  </elf-container>
`);

export { PageSteps };
