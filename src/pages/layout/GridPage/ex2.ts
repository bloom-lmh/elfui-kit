import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  unequal: { zh: "不等分布局", en: "Unequal columns" },
  unequalTitle: { zh: "主工作区与状态侧栏", en: "Main workspace with a status sidebar" },
  workspace: { zh: "交付趋势", en: "Delivery trend" },
  workspaceMeta: { zh: "最近 6 个迭代", en: "Last 6 iterations" },
  health: { zh: "系统健康度", en: "System health" },
  spacing: { zh: "不同间距", en: "Spacing scale" },
  spacingTitle: { zh: "卡片密度对比", en: "Compare card density" },
  columns: { zh: "自定义列数", en: "Custom column count" },
  columnsTitle: { zh: "24 列精细栅格", en: "A precise 24-column grid" },
  auto: { zh: "自动响应式网格", en: "Automatic responsive grid" },
  autoTitle: { zh: "auto-fit 与最小卡片宽度", en: "auto-fit with a minimum card width" },
  team: { zh: "团队空间", en: "Team space" },
  teamMeta: { zh: "自动适应可用宽度", en: "Adapts to available width" },
  release: { zh: "发布状态", en: "Release status" },
  releaseMeta: { zh: "无需手动计算 span", en: "No manual span calculation" },
  usage: { zh: "资源用量", en: "Resource usage" },
  usageMeta: { zh: "窄屏自动换行", en: "Wraps automatically on narrow screens" },
  script: { zh: "gutter 是 gap 的兼容别名，columns 可以调整总列数。", en: "gutter aliases gap, while columns changes the total column count." }
});

const unequalCode = (): string => `<elf-grid gap="md">
  <elf-grid-item span="8"><article>${t("workspace")}</article></elf-grid-item>
  <elf-grid-item span="4"><article>${t("health")}</article></elf-grid-item>
</elf-grid>`;
const spacingCode = (): string => `<elf-grid gap="xs">...</elf-grid>
<elf-grid gap="md">...</elf-grid>
<elf-grid gap="xl">...</elf-grid>`;
const columnsCode = (): string => `<elf-grid columns="24" gap="sm">
  <elf-grid-item span="6"><article>6 / 24</article></elf-grid-item>
  <elf-grid-item span="12"><article>12 / 24</article></elf-grid-item>
  <elf-grid-item span="6"><article>6 / 24</article></elf-grid-item>
</elf-grid>`;
const autoCode = (): string => `<elf-grid auto-fit min-column-width="240px" gap="md">
  <article>${t("team")}</article><article>${t("release")}</article><article>${t("usage")}</article>
</elf-grid>`;
const script = (): string => `// ${t("script")}`;

defineStyle(demoStyles);

const PageGridEx2 = defineHtml(html`
  <h2>${t("unequal")}</h2>
  <elf-playground :title=${t("unequalTitle")} :code=${unequalCode()} :script=${script()}>
    <elf-grid gap="md" style="width:100%">
      <elf-grid-item span="8"><article class="demo-card dashboard-card tone-primary"><div class="grid-label"><span>${t("workspace")}</span><span>${t("workspaceMeta")}</span></div><strong class="metric-value">82%</strong><div class="bar-chart"><i style="--height:38%"></i><i style="--height:62%"></i><i style="--height:50%"></i><i style="--height:78%"></i><i style="--height:66%"></i><i style="--height:88%"></i></div></article></elf-grid-item>
      <elf-grid-item span="4"><article class="demo-card dashboard-card tone-success"><small>${t("health")}</small><strong class="metric-value" style="color:var(--elf-success)">99.98%</strong><div class="mini-progress" style="--progress:99%"></div><span class="metric-trend">● Operational</span></article></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <h2>${t("spacing")}</h2>
  <elf-playground :title=${t("spacingTitle")} :code=${spacingCode()} :script=${script()}>
    <div class="demo-stack">
      <elf-grid gap="xs"><elf-grid-item span="4"><article class="demo-card compact"><strong>xs</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact"><strong>4px</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact"><span class="chip">Dense</span></article></elf-grid-item></elf-grid>
      <elf-grid gap="md"><elf-grid-item span="4"><article class="demo-card compact tone-primary"><strong>md</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact tone-primary"><strong>16px</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact tone-primary"><span class="chip">Default</span></article></elf-grid-item></elf-grid>
      <elf-grid gap="xl"><elf-grid-item span="4"><article class="demo-card compact tone-success"><strong>xl</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact tone-success"><strong>32px</strong></article></elf-grid-item><elf-grid-item span="4"><article class="demo-card compact tone-success"><span class="chip">Airy</span></article></elf-grid-item></elf-grid>
    </div>
  </elf-playground>

  <h2>${t("columns")}</h2>
  <elf-playground :title=${t("columnsTitle")} :code=${columnsCode()} :script=${script()}>
    <elf-grid columns="24" gap="sm" style="width:100%">
      <elf-grid-item span="6"><article class="demo-card compact"><strong>6 / 24</strong><small>25%</small></article></elf-grid-item>
      <elf-grid-item span="12"><article class="demo-card compact tone-primary"><strong>12 / 24</strong><small>50%</small></article></elf-grid-item>
      <elf-grid-item span="6"><article class="demo-card compact"><strong>6 / 24</strong><small>25%</small></article></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <h2>${t("auto")}</h2>
  <elf-playground :title=${t("autoTitle")} :code=${autoCode()} :script=${script()}>
    <elf-grid auto-fit min-column-width="240px" gap="md" style="width:100%">
      <article class="demo-card tone-primary"><span class="avatar">TS</span><strong class="metric-value">${t("team")}</strong><small>${t("teamMeta")}</small></article>
      <article class="demo-card tone-success"><span class="avatar success">RS</span><strong class="metric-value">${t("release")}</strong><small>${t("releaseMeta")}</small></article>
      <article class="demo-card tone-warning"><span class="avatar">RU</span><strong class="metric-value">${t("usage")}</strong><small>${t("usageMeta")}</small></article>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx2 };
