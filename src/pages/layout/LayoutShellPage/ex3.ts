import { defineHtml, defineStyle, html } from "elfui";

const nestedCode = `<elf-layout direction="horizontal">
  <elf-aside width="72px">主导航</elf-aside>
  <elf-layout>
    <elf-header height="52px">工作区标题</elf-header>
    <elf-layout direction="horizontal">
      <elf-aside width="176px">二级导航</elf-aside>
      <elf-main>工作内容</elf-main>
    </elf-layout>
    <elf-footer height="36px">状态栏</elf-footer>
  </elf-layout>
</elf-layout>`;

const detailCode = `<elf-layout>
  <elf-header height="52px">项目详情</elf-header>
  <elf-layout direction="horizontal">
    <elf-main>主内容</elf-main>
    <elf-aside width="220px">详情侧栏</elf-aside>
  </elf-layout>
</elf-layout>`;

const script = `// Layout 可以继续嵌套，尺寸仍由 Header / Aside / Footer 自己声明。`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .layout-canvas { width:100%; height:350px; overflow:hidden; border:1px dashed var(--elf-border-strong); border-radius:4px; background:var(--elf-bg-paper); }
  .layout-canvas.compact { height:300px; }
  .rail, .subnav, .details { padding:14px; border-color:var(--elf-divider); background:color-mix(in srgb,var(--elf-text-primary) 3%,var(--elf-bg-paper)); }
  .rail { display:grid; align-content:start; justify-items:center; gap:12px; border-right:1px dashed var(--elf-border-strong); }
  .subnav { border-right:1px dashed var(--elf-border-strong); }
  .details { border-left:1px dashed var(--elf-border-strong); }
  .shell-header, .shell-footer { justify-content:space-between; border-color:var(--elf-divider); background:transparent; }
  .shell-header { border-bottom:1px dashed var(--elf-border-strong); }
  .shell-footer { border-top:1px dashed var(--elf-border-strong); font-size:12px; }
  .shell-main { padding:18px; background:transparent; }
  .rail-mark { display:grid; width:32px; height:32px; place-items:center; border:1px dashed var(--elf-primary); border-radius:4px; color:var(--elf-primary); font-weight:800; }
  .nav-line { display:block; width:100%; padding:8px; border:1px dashed var(--elf-border); border-radius:3px; color:var(--elf-text-secondary); font-size:12px; }
  .content-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .content-grid article { min-height:84px; padding:14px; border:1px dashed var(--elf-border-strong); border-radius:4px; }
  .content-grid article:last-child { grid-column:1 / -1; min-height:110px; }
  @media (max-width:640px) { .subnav, .details { display:none; } .content-grid { grid-template-columns:1fr; } .content-grid article:last-child { grid-column:auto; } }
`);

const PageLayoutShellEx3 = defineHtml(html`
  <h2>多级应用工作区</h2>
  <elf-playground title="主导航 + 二级导航 + 内容 + 状态栏" :code=${nestedCode} :script=${script}>
    <div class="layout-canvas">
      <elf-layout direction="horizontal" style="height:100%">
        <elf-aside class="rail" width="72px">
          <span class="rail-mark">E</span><span class="rail-mark">01</span><span class="rail-mark">02</span>
        </elf-aside>
        <elf-layout>
          <elf-header class="shell-header" height="52px"><strong>设计工作区</strong><span>林舟</span></elf-header>
          <elf-layout direction="horizontal">
            <elf-aside class="subnav" width="176px">
              <strong>项目导航</strong><span class="nav-line">概览</span><span class="nav-line">资源</span><span class="nav-line">发布</span>
            </elf-aside>
            <elf-main class="shell-main">
              <div class="content-grid"><article>待处理<br><strong>18</strong></article><article>本周发布<br><strong>6</strong></article><article>项目活动趋势</article></div>
            </elf-main>
          </elf-layout>
          <elf-footer class="shell-footer" height="36px"><span>同步完成</span><span>v1.0.0</span></elf-footer>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>

  <h2>详情页右侧栏</h2>
  <elf-playground title="header + main + right aside" :code=${detailCode} :script=${script}>
    <div class="layout-canvas compact">
      <elf-layout style="height:100%">
        <elf-header class="shell-header" height="52px"><strong>发布详情</strong><span>草稿</span></elf-header>
        <elf-layout direction="horizontal">
          <elf-main class="shell-main"><div class="content-grid"><article>版本说明</article><article>检查结果</article><article>变更内容</article></div></elf-main>
          <elf-aside class="details" width="220px"><strong>属性</strong><span class="nav-line">负责人 · 林舟</span><span class="nav-line">环境 · 生产</span></elf-aside>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx3 };
