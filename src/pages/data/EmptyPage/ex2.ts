import { defineHtml, html } from "@elfui/core";

const customCode = `<elf-empty description="筛选条件没有命中" image-size="96">
  <span slot="image">⌕</span>
  <elf-button size="sm">重置筛选</elf-button>
</elf-empty>`;

const PageEmptyEx2 = defineHtml(html`
<elf-playground title="自定义插槽" :code=${customCode}>
      <elf-empty description="筛选条件没有命中" image-size="96">
        <span slot="image">⌕</span>
        <elf-button size="sm">重置筛选</elf-button>
      </elf-empty>
    </elf-playground>
`);

export { PageEmptyEx2 };
