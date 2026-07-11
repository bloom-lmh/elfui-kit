import { defineHtml, html } from "elfui";

const code1 = `<elf-button size="sm">小</elf-button>
<elf-button size="md">中</elf-button>
<elf-button size="lg">大</elf-button>`;

const code2 = `<elf-button>default</elf-button>
<elf-button shape="round">round</elf-button>
<elf-button shape="circle"><span slot="icon">★</span></elf-button>`;

const code3 = `<elf-button color="primary"><span slot="icon">↓</span>下载</elf-button>
<elf-button color="success">发送<span slot="suffix-icon">→</span></elf-button>`;

const PageButtonEx2 = defineHtml(html`
  <h2>尺寸</h2>
  <elf-playground title="sm / md / lg" :code="code1">
    <elf-button size="sm">小</elf-button><elf-button size="md">中</elf-button
    ><elf-button size="lg">大</elf-button>
  </elf-playground>
  <h2>形状</h2>
  <elf-playground title="default / round / circle / square" :code="code2">
    <elf-button>default</elf-button><elf-button shape="round">round</elf-button
    ><elf-button shape="circle"><span slot="icon">★</span></elf-button
    ><elf-button shape="square"><span slot="icon">▦</span></elf-button>
  </elf-playground>
  <h2>图标</h2>
  <elf-playground title="前置 / 后置图标" :code="code3">
    <elf-button color="primary"><span slot="icon">↓</span>下载</elf-button
    ><elf-button color="success">发送<span slot="suffix-icon">→</span></elf-button
    ><elf-button variant="outlined" color="info"><span slot="icon">⟳</span>刷新</elf-button>
  </elf-playground>
`);

export { PageButtonEx2 };
