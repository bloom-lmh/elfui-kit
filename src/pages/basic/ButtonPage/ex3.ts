import { defineHtml, html } from "elfui";

const stateCode = `<elf-button disabled>禁用</elf-button>
<elf-button loading>加载中</elf-button>
<elf-button loading variant="outlined" color="success">提交中</elf-button>`;

const blockCode = `<elf-button block>整行按钮</elf-button>`;

const compatibleCode = `<elf-button type="success" icon="✓">type success</elf-button>
<elf-button text bg type="primary">text bg</elf-button>
<elf-button link type="danger">link danger</elf-button>
<elf-button circle icon="+" aria-label="add"></elf-button>
<elf-button native-type="submit">submit</elf-button>`;

const PageButtonEx3 = defineHtml(html`
  <h2>状态</h2>
  <elf-playground title="disabled / loading" :code=${stateCode}>
    <elf-button disabled>禁用</elf-button>
    <elf-button loading>加载中</elf-button>
    <elf-button loading variant="outlined" color="success">提交中</elf-button>
  </elf-playground>
  <elf-playground title="block" :code=${blockCode}>
    <elf-button block style="width:100%">整行按钮</elf-button>
  </elf-playground>
  <elf-playground title="Element Plus compatible props" :code=${compatibleCode}>
    <elf-button type="success" icon="✓">type success</elf-button>
    <elf-button text bg type="primary">text bg</elf-button>
    <elf-button link type="danger">link danger</elf-button>
    <elf-button circle icon="+" aria-label="add"></elf-button>
    <elf-button native-type="submit">submit</elf-button>
  </elf-playground>
`);

export { PageButtonEx3 };
