import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../demo-cards.scss?inline";

const t = createDocsTranslator({
  heading: { zh: "数据看板", en: "Data dashboard" },
  title: { zh: "非对称分析网格", en: "Asymmetric analytics grid" },
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
        <article class="demo-card dashboard-card tone-primary" style="min-height:310px">
          <div class="grid-label"><span>${t("users")}</span><span>+18.4%</span></div><strong class="metric-value">128,480</strong>
          <div class="bar-chart" style="height:158px"><i style="--height:28%"></i><i style="--height:44%"></i><i style="--height:36%"></i><i style="--height:63%"></i><i style="--height:52%"></i><i style="--height:77%"></i><i style="--height:68%"></i><i style="--height:91%"></i><i style="--height:82%"></i></div>
        </article>
      </elf-grid-item>
      <elf-grid-item span="4" :sm=${12}>
        <article class="demo-card dashboard-card" style="min-height:310px"><small>${t("channels")}</small><div class="donut"></div><p style="text-align:center;color:var(--elf-text-secondary);font-size:12px">${t("organic")}</p></article>
      </elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article class="demo-card"><small>${t("conversion")}</small><strong class="metric-value">12.8%</strong><span class="metric-trend">+2.1%</span></article></elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article class="demo-card"><small>${t("duration")}</small><strong class="metric-value">8m 24s</strong><div class="mini-progress" style="--progress:66%"></div></article></elf-grid-item>
      <elf-grid-item span="6" :sm=${12}><article class="demo-card tone-success"><small>${t("health")}</small><strong class="metric-value" style="color:var(--elf-success)">99.98%</strong><span class="metric-trend">● Operational</span></article></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx4 };
