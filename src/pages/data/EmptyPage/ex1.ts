import { defineHtml, html } from "elfui";

const basicCode = `<elf-empty description="暂无数据" />`;

const PageEmptyEx1 = defineHtml(html`
<elf-playground title="默认空状态" :code=${basicCode}>
      <elf-empty description="暂无数据"></elf-empty>
    </elf-playground>
`);

export { PageEmptyEx1 };
