import { defineHtml, defineStyle, html } from "elfui";

import { useLocaleProvider } from "../../components/Providers/context";
import styles from "./style.scss?inline";

// Injected context
const locale = useLocaleProvider();

// Derived content
const t = (key: string): string => locale.t(`home.${key}`);

defineStyle(styles);

const PageHome = defineHtml(html`
  <main class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span>${t("eyebrow")}</div>
        <h1 id="home-title">ELFUI-KIT</h1>
        <p class="hero-tagline">${t("titleLead")} <span>${t("titleAccent")}</span></p>
        <p class="hero-description">${t("description")}</p>

        <div class="hero-actions">
          <a class="action action-primary" href="#/basic/button">
            ${t("primaryAction")}<span aria-hidden="true">→</span>
          </a>
          <a class="action action-secondary" href="#/providers/theme">
            ${t("secondaryAction")}<span aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="proof" :aria-label=${t("proofLabel")}>
          <span><b>90+</b>${t("proofComponents")}</span>
          <span><b>900+</b>${t("proofTests")}</span>
          <span><b>0</b>${t("proofRuntime")}</span>
        </div>
      </div>

      <div class="hero-visual" :aria-label=${t("visualLabel")}>
        <div class="visual-glow"></div>
        <div class="window">
          <div class="window-bar">
            <span class="window-dots"><i></i><i></i><i></i></span>
            <span>dashboard.ts</span>
            <span class="window-status">${t("live")}</span>
          </div>
          <div class="window-body">
            <div class="mini-nav">
              <span class="mini-brand">E</span>
              <span class="mini-line is-active"></span>
              <span class="mini-line"></span>
              <span class="mini-line is-short"></span>
            </div>
            <div class="mini-content">
              <div class="mini-heading">
                <span><small>${t("visualEyebrow")}</small>${t("visualTitle")}</span>
                <i></i>
              </div>
              <div class="metric-grid">
                <article><small>${t("metricRevenue")}</small><b>¥ 86,420</b><em>+18.4%</em></article>
                <article><small>${t("metricUsers")}</small><b>12,860</b><em>+9.2%</em></article>
              </div>
              <div class="chart-card">
                <div class="chart-title"><span>${t("metricActivity")}</span><small>${t("metricWeek")}</small></div>
                <div class="chart" aria-hidden="true">
                  <i style="--h:34%"></i><i style="--h:52%"></i><i style="--h:44%"></i>
                  <i style="--h:72%"></i><i style="--h:62%"></i><i style="--h:88%"></i><i style="--h:76%"></i>
                </div>
              </div>
              <div class="floating-chip"><span>✓</span>${t("visualReady")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="principles" aria-labelledby="principles-title">
      <div class="section-heading">
        <span>${t("principlesEyebrow")}</span>
        <h2 id="principles-title">${t("principlesTitle")}</h2>
        <p>${t("principlesDescription")}</p>
      </div>
      <div class="principle-grid">
        <article>
          <div class="principle-icon">01</div>
          <h3>${t("principleOneTitle")}</h3>
          <p>${t("principleOneDescription")}</p>
          <code>Custom Elements · Shadow DOM</code>
        </article>
        <article>
          <div class="principle-icon">02</div>
          <h3>${t("principleTwoTitle")}</h3>
          <p>${t("principleTwoDescription")}</p>
          <code>Provider · CSS variables</code>
        </article>
        <article>
          <div class="principle-icon">03</div>
          <h3>${t("principleThreeTitle")}</h3>
          <p>${t("principleThreeDescription")}</p>
          <code>Keyboard · ARIA · Form</code>
        </article>
      </div>
    </section>

    <section class="starter" aria-labelledby="starter-title">
      <div class="starter-copy">
        <span class="section-kicker">${t("starterEyebrow")}</span>
        <h2 id="starter-title">${t("starterTitle")}</h2>
        <p>${t("starterDescription")}</p>
        <div class="starter-links">
          <a href="#/form/input">${t("starterForm")}<span>→</span></a>
          <a href="#/data/table">${t("starterData")}<span>→</span></a>
          <a href="#/layout/grid">${t("starterLayout")}<span>→</span></a>
        </div>
      </div>
      <div class="code-card">
        <div class="code-header"><span>${t("codeTitle")}</span><small>app.html</small></div>
        <pre><code><span class="code-muted">&lt;!-- ${t("codeComment")} --&gt;</span>
<span class="code-key">&lt;elf-locale-provider</span> name=<span class="code-string">"en-US"</span><span class="code-key">&gt;</span>
  <span class="code-key">&lt;elf-theme-provider</span> theme=<span class="code-string">"dark"</span><span class="code-key">&gt;</span>
    <span class="code-key">&lt;app-shell /&gt;</span>
  <span class="code-key">&lt;/elf-theme-provider&gt;</span>
<span class="code-key">&lt;/elf-locale-provider&gt;</span></code></pre>
      </div>
    </section>
  </main>
`);

export { PageHome };
