import { defineHtml, html } from "elfui";

const code1 = `<elf-tag>默认</elf-tag>
<elf-tag color="success">成功</elf-tag>
<elf-tag color="warning">警告</elf-tag>
<elf-tag color="danger">危险</elf-tag>`;

const code2 = `<elf-tag variant="filled">filled</elf-tag>
<elf-tag variant="light">light</elf-tag>
<elf-tag variant="outlined">outlined</elf-tag>`;

const code3 = `<elf-tag size="sm">小</elf-tag>
<elf-tag size="md">中</elf-tag>
<elf-tag size="lg">大</elf-tag>`;

const PageTagEx1 = defineHtml(html`
  <h2>颜色</h2>
  <elf-playground title="6 种语义颜色" :code="code1"
    ><elf-tag>默认</elf-tag><elf-tag color="success">成功</elf-tag
    ><elf-tag color="warning">警告</elf-tag><elf-tag color="danger">危险</elf-tag
    ><elf-tag color="info">信息</elf-tag><elf-tag color="secondary">次要</elf-tag>
  </elf-playground>
  <h2>变体</h2>
  <elf-playground title="filled / light / outlined" :code="code2"
    ><elf-tag variant="filled" color="primary">filled</elf-tag
    ><elf-tag variant="light" color="primary">light</elf-tag
    ><elf-tag variant="outlined" color="primary">outlined</elf-tag>
  </elf-playground>
  <h2>尺寸</h2>
  <elf-playground title="sm / md / lg" :code="code3"
    ><elf-tag size="sm">小</elf-tag><elf-tag size="md">中</elf-tag><elf-tag size="lg">大</elf-tag>
  </elf-playground>
`);

export { PageTagEx1 };
