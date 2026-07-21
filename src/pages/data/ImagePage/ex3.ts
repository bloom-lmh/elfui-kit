import { defineHtml, defineStyle, html } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const imageSrc = "https://picsum.photos/id/1018/960/540";
const t = createDocsTranslator({
  title: { zh: "懒加载与自定义加载动画", en: "Lazy loading and custom indicator" },
  description: {
    zh: "图片接近页面视口时才请求资源；loading 插槽可以替换默认加载动画。",
    en: "The image is requested near the viewport; the loading slot replaces the default indicator."
  },
  loading: { zh: "正在加载图片", en: "Loading image" },
  alt: { zh: "山间河谷", en: "Mountain valley" }
});

const code = `<elf-image :src="imageSrc" alt="山间河谷" :width="480" :height="270" lazy>
  <div slot="loading" class="custom-image-loader">
    <span class="custom-image-loader__ring"></span>
    <span>正在加载图片</span>
  </div>
</elf-image>`;
const script = `const imageSrc = "https://picsum.photos/id/1018/960/540";`;

defineStyle(`
  .lazy-image-demo { display:grid; justify-items:center; gap:16px; width:100%; max-width:720px; margin-inline:auto; }
  .lazy-image-demo p { margin:0; color:var(--elf-text-secondary); text-align:center; }
  .custom-image-loader { display:grid; place-items:center; align-content:center; gap:10px; width:100%; height:100%; color:var(--elf-text-secondary); background:var(--elf-bg-muted); }
  .custom-image-loader__ring { width:32px; height:32px; box-sizing:border-box; border:3px solid color-mix(in srgb, var(--elf-primary) 20%, transparent); border-top-color:var(--elf-primary); border-radius:50%; animation:image-demo-spin 700ms linear infinite; }
  @keyframes image-demo-spin { to { transform:rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .custom-image-loader__ring { animation:none; } }
`);

const PageImageEx3 = defineHtml(html`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="lazy-image-demo">
      <p>${t("description")}</p>
      <elf-image :src=${imageSrc} :alt.prop=${t("alt")} :width=${480} :height=${270} lazy>
        <div slot="loading" class="custom-image-loader" role="status">
          <span class="custom-image-loader__ring" aria-hidden="true"></span>
          <span>${t("loading")}</span>
        </div>
      </elf-image>
    </div>
  </elf-playground>
`);

export { PageImageEx3 };
