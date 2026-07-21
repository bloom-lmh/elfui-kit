import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  direction: { zh: "方向", en: "Direction" },
  directionTitle: { zh: "横向卡片与纵向任务流", en: "Horizontal cards and a vertical task flow" },
  project: { zh: "设计系统", en: "Design system" },
  projectMeta: { zh: "12 个组件待验收", en: "12 components awaiting review" },
  research: { zh: "用户研究", en: "User research" },
  researchMeta: { zh: "访谈计划已就绪", en: "Interview plan is ready" },
  release: { zh: "版本发布", en: "Release" },
  releaseMeta: { zh: "预计周五完成", en: "Expected Friday" },
  spacing: { zh: "间距", en: "Spacing" },
  spacingTitle: { zh: "卡片间距比例", en: "Card spacing scale" },
  spacingMeta: { zh: "统一节奏", en: "Consistent rhythm" },
  script: { zh: "direction 与 gap 使用静态布局属性。", en: "direction and gap are declarative layout attributes." }
});

const directionCode = (): string => `<elf-flex direction="row" gap="md">
  <article>${t("project")}</article>
  <article>${t("research")}</article>
</elf-flex>
<elf-flex direction="column" gap="sm">
  <article>${t("project")}</article>
  <article>${t("release")}</article>
</elf-flex>`;

const spacingCode = (): string => `<elf-flex gap="xs"><article>xs</article><article>xs</article></elf-flex>
<elf-flex gap="md"><article>md</article><article>md</article></elf-flex>
<elf-flex gap="xl"><article>xl</article><article>xl</article></elf-flex>`;

const script = (): string => `// ${t("script")}`;

defineStyle(demoStyles);

const PageFlexEx1 = defineHtml(html`
  <h2>${t("direction")}</h2>
  <elf-playground :title=${t("directionTitle")} :code=${directionCode()} :script=${script()}>
    <div class="demo-stack">
      <div class="demo-stage">
        <elf-flex gap="md" wrap>
          <article class="demo-card compact" style="flex:1 1 190px">
            <div class="card-row"><span class="avatar">DS</span><span class="card-copy"><strong>${t("project")}</strong><small>${t("projectMeta")}</small></span></div>
          </article>
          <article class="demo-card compact" style="flex:1 1 190px">
            <div class="card-row"><span class="avatar success">UR</span><span class="card-copy"><strong>${t("research")}</strong><small>${t("researchMeta")}</small></span></div>
          </article>
        </elf-flex>
      </div>
      <div class="demo-stage">
        <elf-flex direction="column" gap="sm">
          <article class="demo-card compact"><span class="card-copy"><strong>01 · ${t("project")}</strong><small>${t("projectMeta")}</small></span></article>
          <article class="demo-card compact"><span class="card-copy"><strong>02 · ${t("release")}</strong><small>${t("releaseMeta")}</small></span></article>
        </elf-flex>
      </div>
    </div>
  </elf-playground>

  <h2>${t("spacing")}</h2>
  <elf-playground :title=${t("spacingTitle")} :code=${spacingCode()} :script=${script()}>
    <div class="demo-stack">
      <elf-flex gap="xs"><article class="demo-card compact" style="flex:1"><strong>xs</strong><small>${t("spacingMeta")}</small></article><article class="demo-card compact" style="flex:1"><strong>4px</strong></article></elf-flex>
      <elf-flex gap="md"><article class="demo-card compact tone-primary" style="flex:1"><strong>md</strong><small>${t("spacingMeta")}</small></article><article class="demo-card compact tone-primary" style="flex:1"><strong>16px</strong></article></elf-flex>
      <elf-flex gap="xl"><article class="demo-card compact tone-success" style="flex:1"><strong>xl</strong><small>${t("spacingMeta")}</small></article><article class="demo-card compact tone-success" style="flex:1"><strong>32px</strong></article></elf-flex>
    </div>
  </elf-playground>
`);

export { PageFlexEx1 };
