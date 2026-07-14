import { defineHtml, html } from "elfui";

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="360" viewBox="0 0 220 360">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
  <rect width="220" height="360" rx="18" fill="url(#g)"/>
  <circle cx="110" cy="105" r="58" fill="#fff" fill-opacity=".92"/>
  <path d="M35 292 90 218l38 45 26-31 31 60Z" fill="#fff" fill-opacity=".82"/>
  <text x="110" y="188" text-anchor="middle" fill="#fff" font-size="24" font-family="sans-serif">220 × 360</text>
</svg>`;

const imageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`;

const code3 = `<div style="height:220px;overflow:auto">
  <div style="height:320px">向下滚动</div>
  <elf-image :src="imageSrc" alt="懒加载图片" :width="320" :height="180" lazy />
</div>`;

const PageImageEx3 = defineHtml(html`
<elf-playground title="图片懒加载" :code=${code3}>
      <div style="width:100%;max-width:520px;height:220px;overflow:auto;padding:0 12px;border:1px solid var(--elf-border);border-radius:12px">
        <div style="height:300px;display:grid;place-items:center;color:var(--elf-text-secondary)">向下滚动，图片进入视口后才设置 src</div>
        <elf-image :src=${imageSrc} alt="懒加载图片" :width=${320} :height=${180} lazy></elf-image>
      </div>
    </elf-playground>
`);

export { PageImageEx3 };
