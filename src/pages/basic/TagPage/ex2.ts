import { defineHtml, html } from "elfui";

const roundCode = `<elf-tag round>round</elf-tag>
<elf-tag round type="success">success</elf-tag>`;

const closableCode = `<elf-tag closable>tag1</elf-tag>
<elf-tag closable type="success">tag2</elf-tag>
<elf-tag closable type="danger">tag3</elf-tag>`;

const checkedCode = `<elf-tag checked hit type="primary">checked</elf-tag>
<elf-tag checked=${false} hit type="info">unchecked</elf-tag>
<elf-tag effect="dark" type="success">dark</elf-tag>
<elf-tag effect="plain" type="warning">plain</elf-tag>`;

const PageTagEx2 = defineHtml(html`
  <h2>圆角</h2>
  <elf-playground title="round" :code=${roundCode}>
    <elf-tag round>round</elf-tag>
    <elf-tag round type="success">success</elf-tag>
    <elf-tag round variant="outlined" type="warning">warning</elf-tag>
  </elf-playground>
  <h2>可关闭</h2>
  <elf-playground title="closable" :code=${closableCode}>
    <elf-tag closable>tag1</elf-tag>
    <elf-tag closable type="success">tag2</elf-tag>
    <elf-tag closable type="danger">tag3</elf-tag>
  </elf-playground>
  <elf-playground title="checked / hit / effect" :code=${checkedCode}>
    <elf-tag checked hit type="primary">checked</elf-tag>
    <elf-tag :checked=${false} hit type="info">unchecked</elf-tag>
    <elf-tag effect="dark" type="success">dark</elf-tag>
    <elf-tag effect="plain" type="warning">plain</elf-tag>
  </elf-playground>
`);

export { PageTagEx2 };
