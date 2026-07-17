import { defineHtml, html } from "elfui";

const panel = "padding:22px;border:1px solid var(--elf-border);border-radius:18px;background:var(--elf-bg-paper);box-shadow:0 8px 24px rgba(0,0,0,.06);box-sizing:border-box";
const barStyle = (height: number): string => `flex:1;height:${height}px;border-radius:8px 8px 3px 3px;background:color-mix(in srgb,var(--elf-primary) 72%,transparent)`;

const PageGridEx4 = defineHtml(html`
  <h2>数据看板</h2>
  <elf-playground title="非对称 Dashboard 网格">
    <elf-grid columns="12" gutter="18" style="width:100%">
      <elf-grid-item span="8" :md=${{ span: 8 }} :sm=${12}>
        <article style=${`${panel};min-height:310px;background:linear-gradient(150deg,color-mix(in srgb,var(--elf-primary) 12%,var(--elf-bg-paper)),var(--elf-bg-paper) 58%)`}>
          <small style="color:var(--elf-text-secondary)">月度活跃用户</small><strong style="display:block;margin:8px 0 26px;font-size:34px">128,480</strong>
          <div style="display:flex;align-items:end;gap:10px;height:150px">
            <i v-for="height in [38,62,49,88,72,108,126,116,142,132,148,140]" :key="height" :style=${barStyle(height)}></i>
          </div>
        </article>
      </elf-grid-item>
      <elf-grid-item span="4" :sm=${12}>
        <article style=${`${panel};min-height:310px`}><small style="color:var(--elf-text-secondary)">渠道构成</small><div style="width:150px;height:150px;margin:34px auto 20px;border-radius:50%;background:conic-gradient(var(--elf-primary) 0 46%,var(--elf-success) 46% 72%,var(--elf-warning) 72% 88%,var(--elf-divider) 88%)"></div><p style="text-align:center;color:var(--elf-text-secondary)">自然流量 46%</p></article>
      </elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article style=${panel}><small>转化率</small><strong style="display:block;margin-top:8px;font-size:26px">12.8%</strong></article></elf-grid-item>
      <elf-grid-item span="3" :sm=${6} :xs=${12}><article style=${panel}><small>平均停留</small><strong style="display:block;margin-top:8px;font-size:26px">8m 24s</strong></article></elf-grid-item>
      <elf-grid-item span="6" :sm=${12}><article style=${panel}><small>系统健康度</small><strong style="display:block;margin-top:8px;font-size:26px;color:var(--elf-success)">99.98%</strong></article></elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx4 };
