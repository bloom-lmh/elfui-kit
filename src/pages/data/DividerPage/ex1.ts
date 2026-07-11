import { defineHtml, html } from "elfui";

const code1 = `<p>上面内容</p>
<elf-divider />
<p>下面内容</p>`;

const code2 = `<elf-divider content-position="left">靠左</elf-divider>
<elf-divider>居中</elf-divider>
<elf-divider content-position="right">靠右</elf-divider>`;

const PageDividerEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="水平分割线" :code="code1">
    <div style="width:100%;max-width:480px">
      <p>上面内容</p>
      <elf-divider />
      <p>下面内容</p>
    </div>
  </elf-playground>

  <h2>带文字</h2>
  <elf-playground title="content-position: left | center | right" :code="code2">
    <div style="width:100%;max-width:480px">
      <elf-divider content-position="left">靠左</elf-divider><elf-divider>居中</elf-divider
      ><elf-divider content-position="right">靠右</elf-divider>
    </div>
  </elf-playground>
`);

export { PageDividerEx1 };
