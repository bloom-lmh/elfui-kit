import { defineHtml, html } from "elfui";

const code1 = `<elf-alert type="info" title="信息提示"></elf-alert>
<elf-alert type="success" title="操作成功"></elf-alert>
<elf-alert type="warning" title="警告"></elf-alert>
<elf-alert type="danger" title="错误"></elf-alert>`;

const PageAlertEx1 = defineHtml(html`
  <h2>四种类型</h2>
  <elf-playground title="info / success / warning / danger" :code="code1">
    <elf-alert type="info" title="信息提示"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert type="success" title="操作成功"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert type="warning" title="警告"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert type="danger" title="错误"></elf-alert>
  </elf-playground>
`);

export { PageAlertEx1 };
