import { defineHtml, html } from "@elfui/core";

const code2 = `<elf-image src="/not-found-image.png" alt="加载失败" :width="320" :height="180">
  <div slot="error">图片加载失败</div>
</elf-image>`;

const PageImageEx2 = defineHtml(html`
<elf-playground title="加载失败占位" :code=${code2}>
      <elf-image src="/not-found-image.png" alt="加载失败" :width=${320} :height=${180}>
        <div slot="error" style="display:grid;place-items:center;height:100%;color:var(--elf-text-secondary)">
          图片加载失败
        </div>
      </elf-image>
    </elf-playground>
`);

export { PageImageEx2 };
