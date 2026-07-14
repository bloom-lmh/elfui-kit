import { defineHtml, html } from "elfui";

const typeCode = `<elf-link href="#">默认链接</elf-link>
<elf-link type="primary" href="#">主要链接</elf-link>
<elf-link type="success" href="#">成功链接</elf-link>
<elf-link type="warning" href="#">警告链接</elf-link>
<elf-link type="danger" href="#">危险链接</elf-link>
<elf-link type="info" href="#">信息链接</elf-link>`;

const PageLinkEx1 = defineHtml(html`
<elf-playground title="6 种语义类型" :code=${typeCode}>
            <elf-link href="#">默认链接</elf-link>
            <elf-link type="primary" href="#">主要链接</elf-link>
            <elf-link type="success" href="#">成功链接</elf-link>
            <elf-link type="warning" href="#">警告链接</elf-link>
            <elf-link type="danger" href="#">危险链接</elf-link>
            <elf-link type="info" href="#">信息链接</elf-link>
        </elf-playground>
`);

export { PageLinkEx1 };
