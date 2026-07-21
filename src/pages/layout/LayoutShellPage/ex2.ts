import { defineHtml, defineStyle, html } from "elfui";

const code1 = `<elf-layout>
  <elf-header height="48px">顶栏</elf-header>
  <elf-main>主内容</elf-main>
</elf-layout>`;

const code2 = `<elf-layout>
  <elf-aside width="160px">侧栏导航</elf-aside>
  <elf-main>主内容</elf-main>
</elf-layout>`;

const script = `// direction 决定主轴方向，尺寸由 Header / Aside 自己声明。`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .layout-frame { width:100%; height:200px; overflow:hidden; border:1px dashed var(--elf-border-strong); border-radius:4px; background:transparent; }
  .layout-part { background:transparent !important; }
  .layout-header { border-bottom:1px dashed var(--elf-border-strong); }
  .layout-aside { padding:12px; border-right:1px dashed var(--elf-border-strong); }
  .layout-main { padding:16px; }
`);

const PageLayoutShellEx2 = defineHtml(html`
  <h2>仅顶栏 + 内容</h2>
  <elf-playground title="header + main" :code=${code1} :script=${script}>
    <div class="layout-frame">
      <elf-layout style="height: 100%">
        <elf-header class="layout-part layout-header" height="48px">顶栏</elf-header>
        <elf-main class="layout-part layout-main">主内容</elf-main>
      </elf-layout>
    </div>
  </elf-playground>

  <h2>左右分栏（无顶栏）</h2>
  <elf-playground title="aside + main（自动横向）" :code=${code2} :script=${script}>
    <div class="layout-frame">
      <elf-layout style="height: 100%">
        <elf-aside class="layout-part layout-aside" width="160px">侧栏导航</elf-aside>
        <elf-main class="layout-part layout-main">主内容</elf-main>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx2 };
