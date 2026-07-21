import { defineHtml, html } from "elfui";
import { createDocsTranslator } from "../../docsLocale";

const imageSrc = "https://picsum.photos/id/1018/960/540";
const t = createDocsTranslator({
  title: { zh: "图片懒加载", en: "Lazy loading" },
  description: {
    zh: "继续向下滚动页面；图片进入视口后才会请求资源。",
    en: "Continue scrolling. The image is requested only when it approaches the viewport."
  },
  alt: { zh: "山间河谷", en: "Mountain valley" }
});

const code = `<p>继续向下滚动页面；图片进入视口后才会请求资源。</p>
<div style="min-height:55vh" aria-hidden="true"></div>
<elf-image :src="imageSrc" alt="山间河谷" :width="480" :height="270" lazy />`;
const script = `const imageSrc = "https://picsum.photos/id/1018/960/540";`;

const PageImageEx3 = defineHtml(html`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;justify-items:center;width:100%;max-width:720px">
      <p style="margin:0;color:var(--elf-text-secondary)">{{ t("description") }}</p>
      <div style="min-height:55vh" aria-hidden="true"></div>
      <elf-image :src=${imageSrc} :alt.prop=${t("alt")} :width=${480} :height=${270} lazy></elf-image>
    </div>
  </elf-playground>
`);

export { PageImageEx3 };
