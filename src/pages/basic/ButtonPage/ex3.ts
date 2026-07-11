import { defineHtml, html } from "elfui";

const code1 = `<elf-button disabled>禁用</elf-button>
<elf-button loading>加载中</elf-button>
<elf-button loading variant="outlined" color="success">提交中</elf-button>`;

const code2 = `<elf-button block>占满整行</elf-button>`;

const PageButtonEx3 = defineHtml(html`
  <h2>状态</h2>
  <elf-playground title="禁用 / 加载" :code="code1">
    <elf-button disabled>禁用</elf-button><elf-button loading>加载中</elf-button
    ><elf-button loading variant="outlined" color="success">提交中</elf-button>
  </elf-playground>
  <elf-playground title="块级" :code="code2">
    <elf-button block style="width:100%">占满整行</elf-button>
  </elf-playground>
`);

export { PageButtonEx3 };
