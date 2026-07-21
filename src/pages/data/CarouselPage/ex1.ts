import { defineHtml, html } from "elfui";
import { createDocsTranslator } from "../../docsLocale";

const frameStyle = "width:min(100%,1000px);margin-inline:auto";
const t = createDocsTranslator({
  basic: { zh: "基础轮播", en: "Basic carousel" },
  basicTitle: { zh: "真实图片、自动轮播与无感循环", en: "Images, autoplay, and seamless looping" },
  fade: { zh: "渐隐、ghost 箭头与线形指示器", en: "Fade, ghost arrows, and line indicators" },
  fadeTitle: { zh: "统一的渐隐轮播外观", en: "Consistent fade carousel styling" },
  vertical: { zh: "垂直轮播与键盘操作", en: "Vertical carousel and keyboard controls" },
  verticalTitle: { zh: "聚焦后使用方向键、Home 或 End", en: "Use arrow keys, Home, or End after focusing" },
  outside: { zh: "外置指示器", en: "Outside indicators" },
  outsideTitle: { zh: "指示器独立占位，不遮挡图片", en: "Indicators occupy their own space without covering images" },
  cards: { zh: "带标签的卡片轮播", en: "Labeled card carousel" },
  cardsTitle: { zh: "CarouselItem 卡片与可访问标签", en: "CarouselItem cards with accessible labels" },
  valley: { zh: "山谷与河流", en: "Valley and river" }, lake: { zh: "群山与湖泊", en: "Mountains and lake" },
  trail: { zh: "林间小路", en: "Forest trail" }, rocks: { zh: "海边礁石", en: "Coastal rocks" },
  road: { zh: "山间公路", en: "Mountain road" }, shore: { zh: "海岸线", en: "Coastline" },
  peak: { zh: "云雾山峰", en: "Misty peak" }, grassland: { zh: "草原", en: "Grassland" }, berries: { zh: "莓果", en: "Berries" },
  seal: { zh: "海豹", en: "Seal" }, coast: { zh: "海边", en: "Coast" }, dog: { zh: "小狗", en: "Dog" },
  forest: { zh: "森林", en: "Forest" }, city: { zh: "城市", en: "City" },
  stream: { zh: "森林溪流", en: "Forest stream" }, office: { zh: "城市办公桌", en: "City workspace" }, mountains: { zh: "海岸群山", en: "Coastal mountains" }
});

const code1 = `<elf-carousel height="clamp(220px,40vw,400px)" arrow="always">
  <img loading="lazy" src="https://picsum.photos/id/1018/1200/480" alt="Valley and river" />
  <img loading="lazy" src="https://picsum.photos/id/1015/1200/480" alt="Mountains and lake" />
</elf-carousel>`;
const code2 = `<elf-carousel effect="fade" show-arrow="ghost" indicator-type="line" height="clamp(220px,40vw,400px)">
  <img loading="lazy" src="https://picsum.photos/id/1039/1200/480" alt="Coastal rocks" />
  <img loading="lazy" src="https://picsum.photos/id/1043/1200/480" alt="Mountain road" />
</elf-carousel>`;
const code3 = `<elf-carousel direction="vertical" trigger="click" show-arrow="ghost" indicator-type="line" :autoplay="false">
  <img loading="lazy" src="https://picsum.photos/id/1067/1200/480" alt="Misty peak" />
  <img loading="lazy" src="https://picsum.photos/id/1074/1200/480" alt="Grassland" />
</elf-carousel>`;
const code4 = `<elf-carousel indicator-position="outside" arrow="always" :autoplay="false">
  <img loading="lazy" src="https://picsum.photos/id/1084/1200/480" alt="Seal" />
  <img loading="lazy" src="https://picsum.photos/id/1025/1200/480" alt="Dog" />
</elf-carousel>`;
const code5 = `<elf-carousel type="card" :autoplay="false">
  <elf-carousel-item name="forest" label="Forest"><img src="https://picsum.photos/id/15/1200/480" alt="Forest stream" /></elf-carousel-item>
  <elf-carousel-item name="city" label="City"><img src="https://picsum.photos/id/20/1200/480" alt="City workspace" /></elf-carousel-item>
</elf-carousel>`;
const script = `const slides = [
  { src: "https://picsum.photos/id/1018/1200/480", alt: "Valley and river" },
  { src: "https://picsum.photos/id/1015/1200/480", alt: "Mountains and lake" }
];
// Images may also be rendered from data with v-for.`;

const PageCarouselEx1 = defineHtml(html`
  <h2>${t("basic")}</h2>
  <elf-playground :title=${t("basicTitle")} :code=${code1} :script=${script}>
    <elf-carousel height="clamp(220px,40vw,400px)" arrow="always" radius="12px" :style=${frameStyle}>
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1018/1200/480" :alt=${t("valley")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1015/1200/480" :alt=${t("lake")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1019/1200/480" :alt=${t("trail")} />
    </elf-carousel>
  </elf-playground>

  <h2>${t("fade")}</h2>
  <elf-playground :title=${t("fadeTitle")} :code=${code2} :script=${script}>
    <elf-carousel effect="fade" show-arrow="ghost" indicator-type="line" height="clamp(220px,40vw,400px)" radius="12px" :style=${frameStyle}>
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1039/1200/480" :alt=${t("rocks")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1043/1200/480" :alt=${t("road")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1050/1200/480" :alt=${t("shore")} />
    </elf-carousel>
  </elf-playground>

  <h2>${t("vertical")}</h2>
  <elf-playground :title=${t("verticalTitle")} :code=${code3} :script=${script}>
    <elf-carousel direction="vertical" trigger="click" arrow="always" show-arrow="ghost" indicator-type="line" height="clamp(220px,40vw,400px)" :autoplay=${false} radius="12px" :style=${frameStyle}>
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1067/1200/480" :alt=${t("peak")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1074/1200/480" :alt=${t("grassland")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1080/1200/480" :alt=${t("berries")} />
    </elf-carousel>
  </elf-playground>

  <h2>${t("outside")}</h2>
  <elf-playground :title=${t("outsideTitle")} :code=${code4} :script=${script}>
    <elf-carousel indicator-position="outside" arrow="always" height="clamp(220px,40vw,400px)" :autoplay=${false} radius="12px" :style=${frameStyle}>
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1084/1200/480" :alt=${t("seal")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1081/1200/480" :alt=${t("coast")} />
      <img loading="lazy" decoding="async" src="https://picsum.photos/id/1025/1200/480" :alt=${t("dog")} />
    </elf-carousel>
  </elf-playground>

  <h2>${t("cards")}</h2>
  <elf-playground :title=${t("cardsTitle")} :code=${code5} :script=${script}>
    <elf-carousel type="card" height="clamp(220px,40vw,400px)" radius="12px" :autoplay=${false} :style=${frameStyle}>
      <elf-carousel-item name="forest" :label=${t("forest")}><img style="width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async" src="https://picsum.photos/id/15/1200/480" :alt=${t("stream")} /></elf-carousel-item>
      <elf-carousel-item name="city" :label=${t("city")}><img style="width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async" src="https://picsum.photos/id/20/1200/480" :alt=${t("office")} /></elf-carousel-item>
      <elf-carousel-item name="coast" :label=${t("coast")}><img style="width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async" src="https://picsum.photos/id/29/1200/480" :alt=${t("mountains")} /></elf-carousel-item>
    </elf-carousel>
  </elf-playground>
`);

export { PageCarouselEx1 };
