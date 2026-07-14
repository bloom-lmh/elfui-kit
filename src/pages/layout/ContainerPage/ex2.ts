import { defineHtml, html } from "elfui";

const code1 = `<elf-container padding="0" max-width="md">padding=0</elf-container>
<elf-container padding="sm" max-width="md">padding=sm</elf-container>
<elf-container padding="md" max-width="md">padding=md</elf-container>
<elf-container padding="lg" max-width="md">padding=lg</elf-container>`;

const code2 = `<elf-container fluid padding="lg">
  <header>全宽背景区域</header>
  <elf-container max-width="md" padding="md">居中的正文内容</elf-container>
</elf-container>`;

const PageContainerEx2 = defineHtml(html`
  <h2>不同 padding</h2>
  <elf-playground title="0 / sm / md / lg" :code="code1">
    <elf-container
      padding="0"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=0</elf-container
    >
    <elf-container
      padding="sm"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=sm</elf-container
    >
    <elf-container
      padding="md"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=md</elf-container
    >
    <elf-container
      padding="lg"
      max-width="md"
      style="background: var(--elf-bg-overlay); margin: 4px 0; outline: 1px dashed var(--elf-border)"
      >padding=lg</elf-container
    >
  </elf-playground>

  <h2>全宽与内容限宽组合</h2>
  <elf-playground title="fluid 外壳 + 居中正文" :code=${code2}>
    <elf-container fluid padding="lg" style="border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--elf-primary) 14%,var(--elf-bg-paper)),var(--elf-bg-paper))">
      <elf-container max-width="md" padding="md">
        <small style="color:var(--elf-primary);font-weight:700">工作台布局</small>
        <h3 style="margin:8px 0">全宽承载背景，内容保持舒适阅读宽度</h3>
        <p style="margin:0;color:var(--elf-text-secondary);line-height:1.7">适合仪表盘页头、营销横幅和带背景色的业务分区，移动端会自动收紧左右内边距。</p>
      </elf-container>
    </elf-container>
  </elf-playground>
`);

export { PageContainerEx2 };
