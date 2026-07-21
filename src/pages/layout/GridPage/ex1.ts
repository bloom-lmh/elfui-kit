import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  equal: { zh: "等分布局", en: "Equal columns" },
  twoColumns: { zh: "双栏项目卡片", en: "Two-column project cards" },
  threeColumns: { zh: "三栏阶段卡片", en: "Three-column stage cards" },
  design: { zh: "设计系统", en: "Design system" },
  designMeta: { zh: "组件覆盖率 86%", en: "86% component coverage" },
  platform: { zh: "研发平台", en: "Engineering platform" },
  platformMeta: { zh: "本周完成 18 个任务", en: "18 tasks completed this week" },
  discover: { zh: "探索", en: "Discover" },
  build: { zh: "构建", en: "Build" },
  launch: { zh: "发布", en: "Launch" },
  script: { zh: "span 表示卡片占用的栅格列数。", en: "span defines how many grid columns a card occupies." }
});

const twoColumnCode = (): string => `<elf-grid gap="md">
  <elf-grid-item span="6"><article>${t("design")}</article></elf-grid-item>
  <elf-grid-item span="6"><article>${t("platform")}</article></elf-grid-item>
</elf-grid>`;
const threeColumnCode = (): string => `<elf-grid gap="md">
  <elf-grid-item span="4"><article>${t("discover")}</article></elf-grid-item>
  <elf-grid-item span="4"><article>${t("build")}</article></elf-grid-item>
  <elf-grid-item span="4"><article>${t("launch")}</article></elf-grid-item>
</elf-grid>`;
const script = (): string => `// ${t("script")}`;

defineStyle(demoStyles);

const PageGridEx1 = defineHtml(html`
  <h2>${t("equal")}</h2>
  <elf-playground :title=${t("twoColumns")} :code=${twoColumnCode()} :script=${script()}>
    <elf-grid gap="md" style="width:100%">
      <elf-grid-item span="6"><article class="demo-card tone-primary"><div class="card-row"><span class="avatar">DS</span><span class="card-copy"><strong>${t("design")}</strong><small>${t("designMeta")}</small></span></div><div class="mini-progress" style="--progress:86%"></div></article></elf-grid-item>
      <elf-grid-item span="6"><article class="demo-card tone-success"><div class="card-row"><span class="avatar success">EP</span><span class="card-copy"><strong>${t("platform")}</strong><small>${t("platformMeta")}</small></span></div><div class="mini-progress" style="--progress:72%"></div></article></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <elf-playground :title=${t("threeColumns")} :code=${threeColumnCode()} :script=${script()}>
    <elf-grid gap="md" style="width:100%">
      <elf-grid-item span="4"><article class="demo-card"><span class="chip">01</span><strong class="metric-value">${t("discover")}</strong><small>Research · Scope</small></article></elf-grid-item>
      <elf-grid-item span="4"><article class="demo-card tone-primary"><span class="chip">02</span><strong class="metric-value">${t("build")}</strong><small>Design · Develop</small></article></elf-grid-item>
      <elf-grid-item span="4"><article class="demo-card tone-success"><span class="chip">03</span><strong class="metric-value">${t("launch")}</strong><small>Review · Release</small></article></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx1 };
