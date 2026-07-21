import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  heading: { zh: "复杂组合", en: "Complex composition" },
  title: { zh: "非对称响应式网格", en: "Asymmetric responsive grid" },
  users: { zh: "月度活跃用户", en: "Monthly active users" },
  channels: { zh: "渠道构成", en: "Channel mix" },
  organic: { zh: "自然流量 46%", en: "Organic traffic 46%" },
  conversion: { zh: "转化率", en: "Conversion rate" },
  duration: { zh: "平均停留", en: "Average session" },
  health: { zh: "系统健康度", en: "System health" }
});

const code = (): string => `<elf-grid columns="12" gutter="18">
  <elf-grid-item span="8" :sm=\${12}><article>${t("users")}</article></elf-grid-item>
  <elf-grid-item span="4" :sm=\${12}><article>${t("channels")}</article></elf-grid-item>
  <elf-grid-item span="3"><article>${t("conversion")}</article></elf-grid-item>
  <elf-grid-item span="3"><article>${t("duration")}</article></elf-grid-item>
</elf-grid>`;

defineStyle(demoStyles);

const PageGridEx4 = defineHtml(html`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code()}>
    <elf-grid columns="12" gutter="18" style="width:100%">
      <elf-grid-item span="8" :md=${{ span: 8 }} :sm=${12}>
        <article class="demo-card dashboard-card tone-primary" style="min-height:120px">8 / 12 · ${t("users")}</article>
      </elf-grid-item>
      <elf-grid-item span="4" :sm=${12}>
        <article class="demo-card dashboard-card" style="min-height:120px">4 / 12 · ${t("channels")}</article>
      </elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article class="demo-card">3 / 12 · ${t("conversion")}</article></elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article class="demo-card">3 / 12 · ${t("duration")}</article></elf-grid-item>
      <elf-grid-item span="6" :sm=${12}><article class="demo-card tone-success">6 / 12 · ${t("health")}</article></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx4 };
