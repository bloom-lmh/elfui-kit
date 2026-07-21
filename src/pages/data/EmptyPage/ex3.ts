import { defineHtml, html } from "@elfui/core";

const imageCode = `<elf-empty image="/empty-illustration.svg" image-size="120" description="还没有上传图片" />`;

const PageEmptyEx3 = defineHtml(html`
<elf-playground title="自定义图片" :code=${imageCode}>
      <elf-empty image="https://picsum.photos/160/120?random=empty" image-size="120" description="还没有上传图片"></elf-empty>
    </elf-playground>
`);

export { PageEmptyEx3 };
