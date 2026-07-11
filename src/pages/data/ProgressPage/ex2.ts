import { defineHtml, html } from "elfui";

const circleCode = `<elf-progress variant="circle" value="68" />
<elf-progress variant="circle" value="100" status="success" />
<elf-progress variant="circle" value="36" color="#7c3aed" />`;

const statusCode = `<elf-progress value="28" status="warning" striped />
<elf-progress value="64" status="danger" />
<elf-progress indeterminate />`;

const formatter = (percent: number, value: number): string => `${value} / ${percent}%`;

const PageProgressEx2 = defineHtml(html`
  <h2>环形进度</h2>
  <elf-playground title="circle" :code="circleCode">
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <elf-progress variant="circle" value="68"></elf-progress>
      <elf-progress variant="circle" value="100" status="success"></elf-progress>
      <elf-progress variant="circle" value="36" color="#7c3aed"></elf-progress>
    </div>
  </elf-playground>

  <h2>状态与不确定进度</h2>
  <elf-playground title="status / striped / indeterminate" :code="statusCode">
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress value="28" status="warning" striped></elf-progress>
      <elf-progress value="64" status="danger"></elf-progress>
      <elf-progress indeterminate></elf-progress>
      <elf-progress value="42" :format.prop="formatter"></elf-progress>
    </div>
  </elf-playground>
`);

export { PageProgressEx2 };
