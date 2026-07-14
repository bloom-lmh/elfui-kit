import { defineHtml, html, useComponents } from "elfui";
import { PageDescriptionsProps } from "./props";
import { PageDescriptionsEx1 } from "./ex1";
import { PageDescriptionsEx2 } from "./ex2";
import { PageDescriptionsEx3 } from "./ex3";

useComponents({
  "page-descriptions-ex1": PageDescriptionsEx1,
  "page-descriptions-ex2": PageDescriptionsEx2,
  "page-descriptions-ex3": PageDescriptionsEx3,
  "page-descriptions-props": PageDescriptionsProps
});

const PageDescriptions = defineHtml(html`
  <elf-container>
    <h1>Descriptions 描述列表</h1>
    <p>成组展示键值信息，支持列数、边框、垂直布局、尺寸和字段 span。</p>

    <page-descriptions-ex1 />

    <page-descriptions-ex2 />

    <page-descriptions-ex3 />

    <page-descriptions-props></page-descriptions-props>
  </elf-container>
`);

export { PageDescriptions };
