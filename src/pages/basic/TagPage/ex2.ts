import { defineHtml, html } from "elfui";

const code1 = `<elf-tag round>round</elf-tag>
<elf-tag round color="success">success</elf-tag>`;

const code2 = `<elf-tag closable>tag1</elf-tag>
<elf-tag closable color="success">tag2</elf-tag>
<elf-tag closable color="danger">tag3</elf-tag>`;

const PageTagEx2 = defineHtml(html`
  <h2>圆角</h2>
  <elf-playground title="round" :code="code1"
    ><elf-tag round>round</elf-tag><elf-tag round color="success">success</elf-tag
    ><elf-tag round variant="outlined" color="warning">warning</elf-tag>
  </elf-playground>
  <h2>可关闭</h2>
  <elf-playground title="closable" :code="code2"
    ><elf-tag closable>tag1</elf-tag><elf-tag closable color="success">tag2</elf-tag
    ><elf-tag closable color="danger">tag3</elf-tag>
  </elf-playground>
`);

export { PageTagEx2 };
