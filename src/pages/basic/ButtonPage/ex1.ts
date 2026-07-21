import { defineHtml, html } from "@elfui/core";

const code1 = `<elf-button>默认</elf-button>
<elf-button color="success">成功</elf-button>
<elf-button color="warning">警告</elf-button>
<elf-button color="danger">危险</elf-button>
<elf-button color="info">信息</elf-button>
<elf-button color="secondary">次要</elf-button>`;

const code2 = `<elf-button variant="contained">contained</elf-button>
<elf-button variant="outlined">outlined</elf-button>
<elf-button variant="text">text</elf-button>`;

const code3 = `<elf-button variant="contained" plain color="primary">primary</elf-button>
<elf-button variant="contained" plain color="success">success</elf-button>
<elf-button variant="contained" plain color="warning">warning</elf-button>
<elf-button variant="contained" plain color="danger">danger</elf-button>`;

const code4 = `<elf-button variant="outlined" dashed>dashed</elf-button>
<elf-button variant="outlined" dashed color="success">dashed success</elf-button>`;

const PageButtonEx1 = defineHtml(html`
  <h2>颜色</h2>
  <elf-playground title="6 种语义颜色" :code=${code1}>
    <elf-button>默认</elf-button><elf-button color="success">成功</elf-button
    ><elf-button color="warning">警告</elf-button><elf-button color="danger">危险</elf-button
    ><elf-button color="info">信息</elf-button><elf-button color="secondary">次要</elf-button>
  </elf-playground>
  <h2>变体</h2>
  <elf-playground title="contained / outlined / text" :code=${code2}>
    <elf-button variant="contained">contained</elf-button
    ><elf-button variant="outlined">outlined</elf-button
    ><elf-button variant="text">text</elf-button>
  </elf-playground>
  <elf-playground title="plain（淡色背景）" :code=${code3}>
    <elf-button variant="contained" plain color="primary">primary</elf-button
    ><elf-button variant="contained" plain color="success">success</elf-button
    ><elf-button variant="contained" plain color="warning">warning</elf-button
    ><elf-button variant="contained" plain color="danger">danger</elf-button>
  </elf-playground>
  <elf-playground title="虚线边框" :code=${code4}>
    <elf-button variant="outlined" dashed>dashed</elf-button
    ><elf-button variant="outlined" dashed color="success">dashed success</elf-button>
  </elf-playground>
`);

export { PageButtonEx1 };
