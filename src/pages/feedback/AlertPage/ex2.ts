import { defineHtml, html } from "elfui";

const code2 = `<elf-alert type="success" title="保存成功" description="你的更改已经保存到服务器"></elf-alert>
<elf-alert type="warning" title="网络不稳定" description="检测到网络延迟，部分功能可能受影响"></elf-alert>`;

const code3 = `<elf-alert type="success" variant="light" title="light"></elf-alert>
<elf-alert type="success" variant="filled" title="filled"></elf-alert>
<elf-alert type="success" variant="outlined" title="outlined"></elf-alert>`;

const PageAlertEx2 = defineHtml(html`
  <h2>带描述</h2>
  <elf-playground title="title + description" :code="code2">
    <elf-alert type="success" title="保存成功" description="你的更改已经保存到服务器"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert
      type="warning"
      title="网络不稳定"
      description="检测到网络延迟，部分功能可能受影响"
    ></elf-alert>
  </elf-playground>

  <h2>变体</h2>
  <elf-playground title="light / filled / outlined" :code="code3">
    <elf-alert type="success" variant="light" title="light"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert type="success" variant="filled" title="filled"></elf-alert>
    <div style="height: 8px"></div>
    <elf-alert type="success" variant="outlined" title="outlined"></elf-alert>
  </elf-playground>
`);

export { PageAlertEx2 };
