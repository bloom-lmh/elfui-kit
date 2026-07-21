import { defineHtml, html } from "@elfui/core";

const stateCode = `<elf-button disabled>禁用</elf-button>
<elf-button loading>加载中</elf-button>
<elf-button loading variant="outlined" color="success">提交中</elf-button>`;

const blockCode = `<elf-button block>整行按钮</elf-button>`;

const textLinkCode = `<elf-button text bg color="primary">text bg</elf-button>
<elf-button link color="danger">link danger</elf-button>`;

const typeAliasCode = `<elf-button type="success" icon="✓">type="success"</elf-button>
<elf-button type="submit" native-type="submit">submit</elf-button>`;

const noHoverCode = `<elf-button no-hover color="primary">无 hover</elf-button>
<elf-button no-hover variant="outlined" color="danger">无 hover outlined</elf-button>`;

const PageButtonEx3 = defineHtml(html`
    <h2>状态</h2>
    <elf-playground title="disabled / loading" :code=${stateCode}>
        <elf-button disabled>禁用</elf-button>
        <elf-button loading>加载中</elf-button>
        <elf-button loading variant="outlined" color="success">提交中</elf-button>
    </elf-playground>
    <elf-playground title="block 整行按钮" :code=${blockCode}>
        <elf-button block style="width:100%">整行按钮</elf-button>
    </elf-playground>

    <h2>文字按钮 / 链接按钮</h2>
    <elf-playground title="text bg / link" :code=${textLinkCode}>
        <elf-button text bg color="primary">text bg</elf-button>
        <elf-button link color="danger">link danger</elf-button>
    </elf-playground>

    <h2>类型别名</h2>
    <elf-playground title="type 同时支持语义色和原生按钮类型" :code=${typeAliasCode}>
        <elf-button type="success" icon="✓">type="success"</elf-button>
        <elf-button type="submit" native-type="submit">submit</elf-button>
    </elf-playground>

    <h2>禁用 hover 效果</h2>
    <elf-playground title="no-hover" :code=${noHoverCode}>
        <elf-button no-hover color="primary">无 hover</elf-button>
        <elf-button no-hover variant="outlined" color="danger">无 hover outlined</elf-button>
    </elf-playground>
`);

export { PageButtonEx3 };
