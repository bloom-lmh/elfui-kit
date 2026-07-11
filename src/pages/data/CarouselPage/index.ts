import { defineHtml, html, useComponents } from "elfui";
import { PageCarouselEx1 } from "./ex1";
import { PageCarouselProps } from "./props";

useComponents({ "page-carousel-ex1": PageCarouselEx1, "page-carousel-props": PageCarouselProps });

const PageCarousel = defineHtml(html`
  <elf-container
    ><h1>Carousel 轮播图</h1>
    <p>Material Design 风格轮播。支持滑动/渐隐两种效果，自动播放、无限循环、悬停暂停。</p>
    <page-carousel-ex1 /><page-carousel-props
  /></elf-container>
`);

export { PageCarousel };
