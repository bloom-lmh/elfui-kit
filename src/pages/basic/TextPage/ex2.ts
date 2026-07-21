import { defineHtml, html } from "@elfui/core";

const styleCode = `<elf-text strong>加粗</elf-text>
<elf-text italic>斜体</elf-text>
<elf-text mark>标记</elf-text>
<elf-text deleted>删除</elf-text>
<elf-text inserted>插入</elf-text>`;

const PageTextEx2 = defineHtml(html`
<elf-playground title="文本样式" :code=${styleCode}>
      <elf-text strong>加粗</elf-text>
      <elf-text italic>斜体</elf-text>
      <elf-text mark>标记</elf-text>
      <elf-text deleted>删除</elf-text>
      <elf-text inserted>插入</elf-text>
    </elf-playground>
`);

export { PageTextEx2 };
