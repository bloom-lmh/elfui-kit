import { defineHtml, defineStyle, html } from "@elfui/core";

const code1 = `<elf-layout>
  <elf-header height="40px">顶栏</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="120px">侧栏</elf-aside>
    <elf-main>主内容</elf-main>
  </elf-layout>
  <elf-footer height="32px">底栏</elf-footer>
</elf-layout>`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .layout-frame { width:100%; height:280px; overflow:hidden; border:1px dashed var(--elf-border-strong); border-radius:4px; background:transparent; }
  .layout-part { border-color:var(--elf-border-strong); background:transparent !important; }
  .layout-header { justify-content:space-between; border-bottom:1px dashed var(--elf-border-strong); }
  .layout-aside { padding:12px; border-right:1px dashed var(--elf-border-strong); }
  .layout-main { padding:16px; }
  .layout-footer { border-top:1px dashed var(--elf-border-strong); font-size:12px; }
`);

const PageLayoutShellEx1 = defineHtml(html`
  <h2>经典后台布局</h2>
  <elf-playground title="顶栏 + 侧栏 + 主内容 + 底栏" :code=${code1}>
    <div class="layout-frame">
      <elf-layout style="height: 100%">
        <elf-header class="layout-part layout-header" height="40px"><span>顶栏</span><span>Header</span></elf-header>
        <elf-layout direction="horizontal">
          <elf-aside class="layout-part layout-aside" width="120px">Aside</elf-aside>
          <elf-main class="layout-part layout-main">Main 内容区</elf-main>
        </elf-layout>
        <elf-footer class="layout-part layout-footer" height="32px">Footer</elf-footer>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx1 };
