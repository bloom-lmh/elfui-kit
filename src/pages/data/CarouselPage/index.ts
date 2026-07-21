import { defineHtml, html, useComponents } from "elfui";
import { createDocsTranslator } from "../../docsLocale";
import { PageCarouselEx1 } from "./ex1";
import { PageCarouselProps } from "./props";

useComponents({ "page-carousel-ex1": PageCarouselEx1, "page-carousel-props": PageCarouselProps });

const t = createDocsTranslator({
  title: { zh: "Carousel 轮播图", en: "Carousel" },
  description: {
    zh: "在有限空间中浏览一组图片，支持滑动、渐隐、自动播放、无感循环、键盘和触摸操作。",
    en: "Browse images in limited space with sliding, fading, autoplay, seamless looping, keyboard, and touch interactions."
  }
});

const PageCarousel = defineHtml(html`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-carousel-ex1></page-carousel-ex1>
    <page-carousel-props></page-carousel-props>
  </elf-container>
`);

export { PageCarousel };
