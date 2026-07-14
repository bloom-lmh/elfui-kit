import { defineHtml, html } from "elfui";

const code1 = `<elf-layout>
  <elf-header height="48px">顶栏</elf-header>
  <elf-main>主内容</elf-main>
</elf-layout>`;

const code2 = `<elf-layout>
  <elf-aside width="160px">侧栏导航</elf-aside>
  <elf-main>主内容</elf-main>
</elf-layout>`;

const script = `// direction 决定主轴方向，尺寸由 Header / Aside 自己声明。`;

const PageLayoutShellEx2 = defineHtml(html`
  <h2>仅顶栏 + 内容</h2>
  <elf-playground title="header + main" :code=${code1} :script=${script}>
    <div
      style="width: 100%; height: 200px; border-radius: var(--elf-radius-md); overflow: hidden; background: var(--elf-bg-paper); box-shadow: var(--elf-shadow-1)"
    >
      <elf-layout style="height: 100%">
        <elf-header height="48px" style="background: rgba(25,118,210,0.12)">顶栏</elf-header>
        <elf-main style="background: rgba(0,0,0,0.02); padding: 16px">主内容</elf-main>
      </elf-layout>
    </div>
  </elf-playground>

  <h2>左右分栏（无顶栏）</h2>
  <elf-playground title="aside + main（自动横向）" :code=${code2} :script=${script}>
    <div
      style="width: 100%; height: 200px; border-radius: var(--elf-radius-md); overflow: hidden; background: var(--elf-bg-paper); box-shadow: var(--elf-shadow-1)"
    >
      <elf-layout style="height: 100%">
        <elf-aside width="160px" style="background: rgba(0,0,0,0.04); padding: 12px"
          >侧栏导航</elf-aside
        >
        <elf-main style="background: rgba(0,0,0,0.02); padding: 16px">主内容</elf-main>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx2 };
