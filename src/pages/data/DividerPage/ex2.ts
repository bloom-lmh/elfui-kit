import { defineHtml, html } from "@elfui/core";

const code1 = `<elf-divider border-style="dashed" />
<elf-divider border-style="dotted">点线分割</elf-divider>
<elf-divider border-style="double">双线分割</elf-divider>`;

const code2 = `<span>文本A</span>
<elf-divider direction="vertical" />
<span>文本B</span>
<elf-divider direction="vertical" />
<span>文本C</span>`;

const PageDividerEx2 = defineHtml(html`
  <h2>线条样式</h2>
  <elf-playground title="border-style" :code=${code1}>
    <div style="width:100%;max-width:480px">
      <elf-divider border-style="dashed" /><elf-divider border-style="dotted">点线分割</elf-divider
      ><elf-divider border-style="double">双线分割</elf-divider>
    </div>
  </elf-playground>

  <h2>垂直</h2>
  <elf-playground title="direction=vertical" :code=${code2}>
    <div style="display:flex;align-items:center;height:40px">
      <span>文本A</span><elf-divider direction="vertical" /><span>文本B</span
      ><elf-divider direction="vertical" /><span>文本C</span>
    </div>
  </elf-playground>
`);

export { PageDividerEx2 };
