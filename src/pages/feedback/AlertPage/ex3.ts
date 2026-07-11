import { defineHtml, html } from "elfui";

const code4 = `<elf-alert type="info" closable title="点 × 关闭我"></elf-alert>`;

const code5 = `<elf-alert type="info" center :show-icon="false" title="居中无图标"></elf-alert>`;

const PageAlertEx3 = defineHtml(html`
  <h2>可关闭</h2>
  <elf-playground title="closable" :code="code4">
    <elf-alert type="info" closable title="点 × 关闭我"></elf-alert>
  </elf-playground>

  <h2>居中 + 无图标</h2>
  <elf-playground title="center / show-icon=false" :code="code5">
    <elf-alert type="info" center :show-icon="false" title="居中无图标"></elf-alert>
  </elf-playground>
`);

export { PageAlertEx3 };
