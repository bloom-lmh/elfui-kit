import { defineHtml, html } from "@elfui/core";

const tagCode = `<elf-text tag="p">段落文本</elf-text>
<elf-text tag="strong">strong 标签</elf-text>
<elf-text tag="mark">mark 标签</elf-text>`;

const PageTextEx3 = defineHtml(html`
<elf-playground title="tag" :code=${tagCode}>
      <elf-text tag="p">段落文本</elf-text>
      <elf-text tag="strong">strong 标签</elf-text>
      <elf-text tag="mark">mark 标签</elf-text>
    </elf-playground>
`);

export { PageTextEx3 };
