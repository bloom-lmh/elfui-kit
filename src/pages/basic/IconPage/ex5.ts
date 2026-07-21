import { defineHtml, html } from "@elfui/core";

const loadingCode = `<elf-icon loading size="24" color="var(--elf-primary)" aria-label="加载中">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </svg>
</elf-icon>`;

const loadingScript = `// 图标通过默认插槽按需提供，不会把整套 SVG 打进组件库。
// loading 属性或宿主的 is-loading 类都可启用旋转；系统要求减少动态效果时会自动停用。`;

const PageIconEx5 = defineHtml(html`
  <elf-playground title="按需 SVG 与加载状态" :code=${loadingCode} :script=${loadingScript}>
    <elf-icon loading size="24" color="var(--elf-primary)" aria-label="加载中">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.22-8.56" />
      </svg>
    </elf-icon>
  </elf-playground>
`);

export { PageIconEx5 };
