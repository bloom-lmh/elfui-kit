import { defineHtml, html } from "elfui";

const circleCode = `<elf-progress type="circle" percentage="68" />
<elf-progress type="circle" percentage="100" status="success" />
<elf-progress type="dashboard" percentage="36" color="#7c3aed" />`;

const statusCode = `<elf-progress percentage="28" status="warning" striped-flow />
<elf-progress percentage="64" status="exception" />
<elf-progress indeterminate duration="1" />
<elf-progress value="42" :format.prop=\${formatter} />`;

const circleScript = `// 静态百分比案例，无需额外状态。`;

const statusScript = `const formatter = (percent: number, value: number): string =>
  \`\${value} / \${percent}%\`;`;

const formatter = (percent: number, value: number): string => `${value} / ${percent}%`;

const PageProgressEx2 = defineHtml(html`
  <h2>环形进度</h2>
  <elf-playground title="圆形与仪表盘进度" :code=${circleCode} :script=${circleScript}>
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <elf-progress type="circle" percentage="68"></elf-progress>
      <elf-progress type="circle" percentage="100" status="success"></elf-progress>
      <elf-progress type="dashboard" percentage="36" color="#7c3aed"></elf-progress>
    </div>
  </elf-playground>

  <h2>状态与不确定进度</h2>
  <elf-playground title="状态、条纹与不确定进度" :code=${statusCode} :script=${statusScript}>
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress percentage="28" status="warning" striped-flow></elf-progress>
      <elf-progress percentage="64" status="exception"></elf-progress>
      <elf-progress indeterminate duration="1"></elf-progress>
      <elf-progress value="42" :format.prop=${formatter}></elf-progress>
    </div>
  </elf-playground>
`);

export { PageProgressEx2 };
