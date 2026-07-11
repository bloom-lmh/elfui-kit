import { defineHtml, html } from "elfui";

const typeCode = `<elf-link href="#/basic/link">默认链接</elf-link>
<elf-link type="primary" href="#/basic/link">主要链接</elf-link>
<elf-link type="success" href="#/basic/link">成功链接</elf-link>
<elf-link type="warning" href="#/basic/link">警告链接</elf-link>
<elf-link type="danger" href="#/basic/link">危险链接</elf-link>
<elf-link type="info" href="#/basic/link">信息链接</elf-link>`;

const stateCode = `<elf-link type="primary" :underline=\${false} href="#/basic/link">
  无下划线
</elf-link>
<elf-link disabled href="#/basic/link">禁用链接</elf-link>
<elf-link icon="↗" href="https://github.com" target="_blank">
  打开 GitHub
</elf-link>`;

const slotCode = `<elf-link type="primary" href="#/basic/link">
  <span slot="icon">#</span>
  自定义 icon slot
</elf-link>`;

const PageLink = defineHtml(html`
  <elf-container>
    <h1>Link 链接</h1>
    <p>文本链接，支持语义类型、下划线、禁用、href/target 与 icon 插槽。</p>

    <elf-playground title="语义类型" :code=${typeCode}>
      <elf-link href="#/basic/link">默认链接</elf-link>
      <elf-link type="primary" href="#/basic/link">主要链接</elf-link>
      <elf-link type="success" href="#/basic/link">成功链接</elf-link>
      <elf-link type="warning" href="#/basic/link">警告链接</elf-link>
      <elf-link type="danger" href="#/basic/link">危险链接</elf-link>
      <elf-link type="info" href="#/basic/link">信息链接</elf-link>
    </elf-playground>

    <elf-playground title="状态与跳转" :code=${stateCode}>
      <elf-link type="primary" :underline=${false} href="#/basic/link">无下划线</elf-link>
      <elf-link disabled href="#/basic/link">禁用链接</elf-link>
      <elf-link icon="↗" href="https://github.com" target="_blank">打开 GitHub</elf-link>
    </elf-playground>

    <elf-playground title="icon slot" :code=${slotCode}>
      <elf-link type="primary" href="#/basic/link">
        <span slot="icon">#</span>
        自定义 icon slot
      </elf-link>
    </elf-playground>
  </elf-container>
`);

export { PageLink };
