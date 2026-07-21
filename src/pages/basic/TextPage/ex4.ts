import { defineHtml, html } from "@elfui/core";

const clampCode = `<div style="width:260px">
  <elf-text truncated>单行截断：很长的文本超出容器时自动省略号。</elf-text>
</div>
<div style="width:320px;margin-top:12px">
  <elf-text line-clamp="2">多行截断：这里展示两行截断效果，内容保持段落阅读感，同时避免卡片被撑得太高。</elf-text>
</div>`;

const PageTextEx4 = defineHtml(html`
<elf-playground title="截断" :code=${clampCode}>
      <div style="width:260px">
        <elf-text truncated>这是一段很长很长的单行文本，超出容器时会被截断。</elf-text>
      </div>
      <div style="width:320px;margin-top:12px">
        <elf-text line-clamp="2">这里展示两行截断。内容会保持段落阅读感，同时避免卡片被撑得太高。</elf-text>
      </div>
    </elf-playground>
`);

export { PageTextEx4 };
