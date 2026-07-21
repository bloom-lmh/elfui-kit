import { defineHtml, html } from "@elfui/core";

const typeCode = `<elf-text>默认文本</elf-text>
<elf-text type="primary">主要文本</elf-text>
<elf-text type="success">成功文本</elf-text>
<elf-text type="warning">警告文本</elf-text>
<elf-text type="danger">危险文本</elf-text>
<elf-text type="info">信息文本</elf-text>`;

const script1 = `// Text 是纯展示组件，通过 props 控制语义、样式和截断`;

const PageTextEx1 = defineHtml(html`
<elf-playground title="语义类型" :code=${typeCode} :script=${script1}>
      <elf-text>默认文本</elf-text>
      <elf-text type="primary">主要文本</elf-text>
      <elf-text type="success">成功文本</elf-text>
      <elf-text type="warning">警告文本</elf-text>
      <elf-text type="danger">危险文本</elf-text>
      <elf-text type="info">信息文本</elf-text>
    </elf-playground>
`);

export { PageTextEx1 };
