import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const mobileColumns = 12;
const desktopColumns = { span: 4, offset: 2 };

const t = createDocsTranslator({
  row: { zh: "Row 兼容属性", en: "Row-compatible props" },
  rowTitle: { zh: "间距与双轴对齐", en: "Spacing and two-axis alignment" },
  centered: { zh: "居中卡片", en: "Centered card" },
  aligned: { zh: "垂直对齐", en: "Vertically aligned" },
  offset: { zh: "偏移与响应式", en: "Offsets and responsiveness" },
  offsetTitle: { zh: "offset、push 与 pull", en: "offset, push, and pull" },
  offsetCard: { zh: "偏移 2 列", en: "Offset by 2 columns" },
  pushed: { zh: "向后移动 1 列", en: "Push by 1 column" },
  pulled: { zh: "向前移动 1 列", en: "Pull by 1 column" },
  responsiveTitle: { zh: "跨断点卡片宽度", en: "Card width across breakpoints" },
  responsiveCard: { zh: "窄屏占满 12 列；桌面端占 4 列并偏移 2 列", en: "12 columns on small screens; 4 columns with a 2-column offset on desktop" }
});

const rowCode = (): string => `<elf-grid gutter="16" justify="center" align="center">
  <elf-grid-item span="3"><article>${t("centered")}</article></elf-grid-item>
  <elf-grid-item span="3"><article>${t("aligned")}</article></elf-grid-item>
</elf-grid>`;
const offsetCode = (): string => `<elf-grid columns="12" gutter="16">
  <elf-grid-item span="4" offset="2"><article>${t("offsetCard")}</article></elf-grid-item>
  <elf-grid-item span="4" push="1"><article>${t("pushed")}</article></elf-grid-item>
</elf-grid>`;
const responsiveCode = (): string => `<elf-grid columns="12" gutter="16">
  <elf-grid-item span="12" :sm=\${mobileColumns} :md=\${desktopColumns}>
    <article>${t("responsiveCard")}</article>
  </elf-grid-item>
</elf-grid>`;
const script = `const mobileColumns = 12;
const desktopColumns = { span: 4, offset: 2 };`;

defineStyle(demoStyles);

const PageGridEx3 = defineHtml(html`
  <h2>${t("row")}</h2>
  <elf-playground :title=${t("rowTitle")} :code=${rowCode()} :script=${script}>
    <div class="demo-stage is-tall">
      <elf-grid gutter="16" justify="center" align="center" style="width:100%;min-height:106px">
        <elf-grid-item span="3"><article class="demo-card compact tone-primary"><div class="card-row"><span class="avatar">C</span><strong>${t("centered")}</strong></div></article></elf-grid-item>
        <elf-grid-item span="3"><article class="demo-card tone-success"><strong>${t("aligned")}</strong><div class="mini-progress" style="--progress:74%"></div></article></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>

  <h2>${t("offset")}</h2>
  <elf-playground :title=${t("offsetTitle")} :code=${offsetCode()} :script=${script}>
    <div class="demo-stack">
      <elf-grid columns="12" gutter="16"><elf-grid-item span="4" offset="2"><article class="demo-card compact tone-primary"><strong>${t("offsetCard")}</strong><small>span 4 · offset 2</small></article></elf-grid-item></elf-grid>
      <elf-grid columns="12" gutter="16"><elf-grid-item span="4" push="1"><article class="demo-card compact tone-success"><strong>${t("pushed")}</strong><small>push 1</small></article></elf-grid-item><elf-grid-item span="4" pull="1"><article class="demo-card compact tone-warning"><strong>${t("pulled")}</strong><small>pull 1</small></article></elf-grid-item></elf-grid>
    </div>
  </elf-playground>

  <elf-playground :title=${t("responsiveTitle")} :code=${responsiveCode()} :script=${script}>
    <elf-grid columns="12" gutter="16" style="width:100%">
      <elf-grid-item span="12" :sm=${mobileColumns} :md=${desktopColumns} data-responsive-demo>
        <article class="demo-card tone-primary"><span class="chip">xs 12 · md 4 + 2</span><strong class="metric-value">${t("responsiveTitle")}</strong><small>${t("responsiveCard")}</small></article>
      </elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx3 };
