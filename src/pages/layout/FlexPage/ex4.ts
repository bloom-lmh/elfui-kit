import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  heading: { zh: "组合布局", en: "Composed layout" },
  title: { zh: "工具栏与弹性内容", en: "Toolbar and flexible content" },
  workspace: { zh: "标题区", en: "Title area" },
  export: { zh: "次操作", en: "Secondary action" },
  create: { zh: "主操作", en: "Primary action" },
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
    <elf-flex direction="column" gap="lg" class="demo-stage" style="width:100%">
      <elf-flex align="center" justify="space-between" gap="md" wrap>
        <div class="demo-card compact" style="flex:1 1 180px">${t("workspace")}</div>
        <elf-flex gap="sm" style="flex:0 1 280px"><span class="demo-card compact" style="flex:1">${t("export")}</span><span class="demo-card compact" style="flex:1">${t("create")}</span></elf-flex>
      </elf-flex>
      <elf-flex gap="md" wrap fill>
        <article class="demo-card tone-primary" style="flex:1 1 180px">${t("active")}</article>
        <article class="demo-card tone-success" style="flex:1 1 180px">${t("releases")}</article>
        <article class="demo-card" style="flex:1 1 180px">${t("delivery")}</article>
      </elf-flex>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx4 };
