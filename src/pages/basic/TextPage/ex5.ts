import { defineHtml, html } from "elfui";

const semanticCode = `<elf-text tag="h2" size="large" strong>账户概览</elf-text>
<elf-text tag="p" size="default">使用语义标签构建标题与段落，不需要额外的 Typography 包装组件。</elf-text>
<elf-text>容量 <elf-text tag="sub" size="small">GB</elf-text></elf-text>`;

const PageTextEx5 = defineHtml(html`
  <elf-playground title="语义排版" :code=${semanticCode}>
    <div style="display:grid;gap:8px">
      <elf-text tag="h2" size="large" strong>账户概览</elf-text>
      <elf-text tag="p" size="default">使用语义标签构建标题与段落，不需要额外的 Typography 包装组件。</elf-text>
      <elf-text>容量 <elf-text tag="sub" size="small">GB</elf-text></elf-text>
    </div>
  </elf-playground>
`);

export { PageTextEx5 };
