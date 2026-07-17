import { defineHtml, html } from "elfui";

const PageFlexEx4 = defineHtml(html`
  <h2>应用级组合</h2>
  <elf-playground title="项目工作台 Header">
    <elf-flex direction="column" gap="lg" style="width:100%;padding:24px;border:1px solid var(--elf-border);border-radius:20px;background:linear-gradient(135deg,color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper)),var(--elf-bg-paper) 52%)">
      <elf-flex align="center" justify="space-between" gap="md" wrap>
        <div><small style="color:var(--elf-primary);font-weight:700">ELFUI WORKSPACE</small><h2 style="margin:6px 0 0;font-size:30px">产品交付中心</h2></div>
        <elf-flex gap="sm"><elf-button variant="outlined">导出报告</elf-button><elf-button>创建项目</elf-button></elf-flex>
      </elf-flex>
      <elf-flex gap="md" wrap fill>
        <article style="flex:1 1 180px;padding:18px;border-radius:14px;background:var(--elf-bg-paper);box-shadow:var(--elf-shadow-1)"><small>进行中</small><strong style="display:block;margin-top:8px;font-size:26px">24</strong></article>
        <article style="flex:1 1 180px;padding:18px;border-radius:14px;background:var(--elf-bg-paper);box-shadow:var(--elf-shadow-1)"><small>本周发布</small><strong style="display:block;margin-top:8px;font-size:26px">8</strong></article>
        <article style="flex:1 1 180px;padding:18px;border-radius:14px;background:var(--elf-bg-paper);box-shadow:var(--elf-shadow-1)"><small>交付率</small><strong style="display:block;margin-top:8px;font-size:26px">96.4%</strong></article>
      </elf-flex>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx4 };
