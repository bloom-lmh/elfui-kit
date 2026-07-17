import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  heading: { zh: "应用级组合", en: "Application composition" },
  title: { zh: "项目交付工作台", en: "Project delivery workspace" },
  workspace: { zh: "产品交付中心", en: "Product delivery center" },
  export: { zh: "导出报告", en: "Export report" },
  create: { zh: "创建项目", en: "Create project" },
  active: { zh: "进行中", en: "In progress" },
  releases: { zh: "本周发布", en: "Released this week" },
  delivery: { zh: "交付率", en: "Delivery rate" }
});

const code = (): string => `<elf-flex direction="column" gap="lg">
  <elf-flex align="center" justify="space-between" wrap>
    <h2>${t("workspace")}</h2>
  </elf-flex>
  <elf-flex gap="md" wrap fill>
    <article>${t("active")}: 24</article>
    <article>${t("releases")}: 8</article>
    <article>${t("delivery")}: 96.4%</article>
  </elf-flex>
</elf-flex>`;

defineStyle(demoStyles);

const PageFlexEx4 = defineHtml(html`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code()}>
    <elf-flex direction="column" gap="lg" class="demo-stage" style="width:100%;padding:24px">
      <elf-flex align="center" justify="space-between" gap="md" wrap>
        <div><small style="color:var(--elf-primary);font-weight:800;letter-spacing:.12em">ELFUI WORKSPACE</small><h2 style="margin:7px 0 0;font-size:28px">${t("workspace")}</h2></div>
        <elf-flex gap="sm"><span class="chip">${t("export")}</span><span class="chip">＋ ${t("create")}</span></elf-flex>
      </elf-flex>
      <elf-flex gap="md" wrap fill>
        <article class="demo-card tone-primary" style="flex:1 1 180px"><small>${t("active")}</small><strong class="metric-value">24</strong><div class="mini-progress" style="--progress:68%"></div></article>
        <article class="demo-card tone-success" style="flex:1 1 180px"><small>${t("releases")}</small><strong class="metric-value">8</strong><span class="metric-trend">+3</span></article>
        <article class="demo-card" style="flex:1 1 180px"><small>${t("delivery")}</small><strong class="metric-value">96.4%</strong><div class="mini-progress" style="--progress:96.4%"></div></article>
      </elf-flex>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx4 };
