import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  mainAxis: { zh: "主轴对齐", en: "Main-axis alignment" },
  justifyTitle: { zh: "项目成员分布", en: "Project member distribution" },
  lead: { zh: "负责人", en: "Lead" },
  designer: { zh: "设计", en: "Design" },
  engineer: { zh: "开发", en: "Engineering" },
  crossAxis: { zh: "交叉轴对齐", en: "Cross-axis alignment" },
  alignTitle: { zh: "不同高度卡片的对齐", en: "Align cards with different heights" },
  brief: { zh: "需求摘要", en: "Brief" },
  review: { zh: "设计评审", en: "Design review" },
  delivery: { zh: "交付清单", en: "Delivery list" },
  wrap: { zh: "响应式换行", en: "Responsive wrapping" },
  wrapTitle: { zh: "流式指标卡片", en: "Fluid metric cards" },
  visits: { zh: "今日访问", en: "Visits today" },
  projects: { zh: "活跃项目", en: "Active projects" },
  pending: { zh: "待处理", en: "Pending" },
  script: { zh: "justify、align、wrap 和 fill 可以独立组合。", en: "justify, align, wrap, and fill can be composed independently." }
});

const justifyCode = (): string => `<elf-flex justify="space-between" gap="sm">
  <article>${t("lead")}</article><article>${t("designer")}</article><article>${t("engineer")}</article>
</elf-flex>`;
const alignCode = (): string => `<elf-flex align="center" gap="md">
  <article>${t("brief")}</article><article>${t("review")}</article><article>${t("delivery")}</article>
</elf-flex>`;
const wrapCode = (): string => `<elf-flex wrap gap="md" fill>
  <article style="flex:1 1 220px">${t("visits")}</article>
  <article style="flex:1 1 220px">${t("projects")}</article>
  <article style="flex:1 1 220px">${t("pending")}</article>
</elf-flex>`;
const script = (): string => `// ${t("script")}`;

defineStyle(demoStyles);

const PageFlexEx2 = defineHtml(html`
  <h2>${t("mainAxis")}</h2>
  <elf-playground :title=${t("justifyTitle")} :code=${justifyCode()} :script=${script()}>
    <div class="demo-stack">
      <div class="demo-stage"><elf-flex justify="flex-start" gap="sm"><article class="demo-card compact"><span class="chip">${t("lead")}</span></article><article class="demo-card compact"><span class="chip">${t("designer")}</span></article></elf-flex></div>
      <div class="demo-stage"><elf-flex justify="center" gap="sm"><article class="demo-card compact"><span class="chip">${t("designer")}</span></article><article class="demo-card compact"><span class="chip">${t("engineer")}</span></article></elf-flex></div>
      <div class="demo-stage"><elf-flex justify="space-between" gap="sm"><article class="demo-card compact"><span class="chip">${t("lead")}</span></article><article class="demo-card compact"><span class="chip">${t("designer")}</span></article><article class="demo-card compact"><span class="chip">${t("engineer")}</span></article></elf-flex></div>
    </div>
  </elf-playground>

  <h2>${t("crossAxis")}</h2>
  <elf-playground :title=${t("alignTitle")} :code=${alignCode()} :script=${script()}>
    <div class="demo-stage is-tall">
      <elf-flex align="center" gap="md" style="min-height:106px">
        <article class="demo-card compact" style="flex:1"><strong>${t("brief")}</strong></article>
        <article class="demo-card" style="flex:1"><strong>${t("review")}</strong><div class="mini-progress" style="--progress:72%"></div></article>
        <article class="demo-card compact" style="flex:1;align-self:stretch"><strong>${t("delivery")}</strong><small>8 / 12</small></article>
      </elf-flex>
    </div>
  </elf-playground>

  <h2>${t("wrap")}</h2>
  <elf-playground :title=${t("wrapTitle")} :code=${wrapCode()} :script=${script()}>
    <elf-flex wrap gap="md" align="stretch" fill style="width:100%">
      <article class="demo-card tone-primary" style="flex:1 1 220px"><small class="metric-label">${t("visits")}</small><strong class="metric-value">12,480</strong><span class="metric-trend">+18.4%</span></article>
      <article class="demo-card tone-success" style="flex:1 1 220px"><small class="metric-label">${t("projects")}</small><strong class="metric-value">36</strong><span class="metric-trend">+4</span></article>
      <article class="demo-card tone-warning" style="flex:1 1 220px"><small class="metric-label">${t("pending")}</small><strong class="metric-value">8</strong><div class="mini-progress" style="--progress:42%"></div></article>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx2 };
