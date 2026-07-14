import { defineHtml, html, useComponents } from "elfui";
import { PageInputTagProps } from "./props";
import { PageInputTagEx1 } from "./ex1";
import { PageInputTagEx2 } from "./ex2";

useComponents({
  "page-input-tag-ex1": PageInputTagEx1,
  "page-input-tag-ex2": PageInputTagEx2,
  "page-input-tag-props": PageInputTagProps
});

const PageInputTag = defineHtml(html`
  <elf-container>
    <h1>InputTag 标签输入</h1>
    <p>把输入内容转换成标签。输入框宽度保持稳定；标签较多时可水平滚动，折叠后悬停数量按钮可查看并删除隐藏标签。</p>

    <page-input-tag-ex1 />

    <page-input-tag-ex2 />
    <page-input-tag-props></page-input-tag-props>
  </elf-container>
`);

export { PageInputTag };
