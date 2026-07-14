import { defineHtml, html } from "elfui";

const slotCode = `<elf-link type="primary" href="#">
  <span slot="icon">#</span>
  自定义 icon slot
</elf-link>`;

const PageLinkEx3 = defineHtml(html`
<elf-playground title="icon 插槽优先于 icon 属性" :code=${slotCode}>
            <elf-link type="primary" href="#">
                <span slot="icon">#</span>
                自定义 icon slot
            </elf-link>
        </elf-playground>
`);

export { PageLinkEx3 };
