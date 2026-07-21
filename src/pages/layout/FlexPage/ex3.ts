import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const asymmetricGap: [number, number] = [20, 8];
const uniformGap = 12;
const fillRatio = 45;

const t = createDocsTranslator({
  heading: { zh: "Space 兼容属性", en: "Space-compatible props" },
  title: { zh: "对齐、间距元组与填充比例", en: "Alignment, spacing tuples, and fill ratio" },
  unified: { zh: "统一间距", en: "Uniform spacing" },
  centered: { zh: "居中对齐", en: "Centered" },
  horizontal: { zh: "水平 20px", en: "20px horizontal" },
  vertical: { zh: "垂直 8px", en: "8px vertical" },
  tuple: { zh: "支持元组", en: "Tuple supported" },
  cardA: { zh: "计划进度", en: "Plan progress" },
  cardB: { zh: "交付质量", en: "Delivery quality" }
});

const code = (): string => `<elf-flex alignment="center" :size=\${uniformGap}>
  <article>${t("unified")}</article><article>${t("centered")}</article>
</elf-flex>
<elf-flex :size=\${asymmetricGap}>
  <article>${t("horizontal")}</article><article>${t("vertical")}</article>
</elf-flex>
<elf-flex fill :fill-ratio=\${fillRatio} gap="md">
  <article>${t("cardA")}</article><article>${t("cardB")}</article>
</elf-flex>`;

const script = `const uniformGap = 12;
const asymmetricGap = [20, 8];
const fillRatio = 45;`;

defineStyle(demoStyles);

const PageFlexEx3 = defineHtml(html`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="demo-stack">
      <elf-flex alignment="center" :size=${uniformGap}>
        <article class="demo-card compact"><span class="chip">12px</span></article>
        <article class="demo-card compact"><span class="card-copy"><strong>${t("unified")}</strong><small>${t("centered")}</small></span></article>
      </elf-flex>
      <elf-flex wrap :size=${asymmetricGap}>
        <article class="demo-card compact tone-primary"><strong>${t("horizontal")}</strong></article>
        <article class="demo-card compact tone-success"><strong>${t("vertical")}</strong></article>
        <article class="demo-card compact"><span class="chip">${t("tuple")}</span></article>
      </elf-flex>
      <elf-flex fill :fill-ratio=${fillRatio} gap="md" style="min-height:0">
        <article class="demo-card tone-primary"><small>${t("cardA")}</small><strong class="metric-value">45%</strong><div class="mini-progress" style="--progress:45%"></div></article>
        <article class="demo-card tone-success"><small>${t("cardB")}</small><strong class="metric-value">45%</strong><div class="mini-progress" style="--progress:88%"></div></article>
      </elf-flex>
    </div>
  </elf-playground>
`);

export { PageFlexEx3 };
