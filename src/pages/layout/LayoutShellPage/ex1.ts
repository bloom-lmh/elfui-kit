import { defineHtml, html } from "elfui";

const code1 = `<elf-layout>
  <elf-header height="40px">顶栏</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="120px">侧栏</elf-aside>
    <elf-main>主内容</elf-main>
  </elf-layout>
  <elf-footer height="32px">底栏</elf-footer>
</elf-layout>`;

const PageLayoutShellEx1 = defineHtml(html`
  <h2>经典后台布局</h2>
  <elf-playground title="顶栏 + 侧栏 + 主内容 + 底栏" :code="code1">
    <div
      style="width: 100%; height: 280px; border-radius: var(--elf-radius-md); overflow: hidden; background: var(--elf-bg-paper); box-shadow: var(--elf-shadow-1)"
    >
      <elf-layout style="height: 100%">
        <elf-header
          height="40px"
          style="background: rgba(25,118,210,0.12); justify-content: space-between"
          ><span>顶栏</span><elf-tag size="sm">Header</elf-tag></elf-header
        >
        <elf-layout direction="horizontal">
          <elf-aside width="120px" style="background: rgba(0,0,0,0.04); padding: 12px"
            ><elf-tag size="sm">Aside</elf-tag></elf-aside
          >
          <elf-main style="background: rgba(0,0,0,0.02); padding: 16px"
            ><elf-tag size="sm">Main 内容区</elf-tag></elf-main
          >
        </elf-layout>
        <elf-footer height="32px" style="background: rgba(25,118,210,0.05); font-size: 12px"
          >底栏 © Footer</elf-footer
        >
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx1 };
