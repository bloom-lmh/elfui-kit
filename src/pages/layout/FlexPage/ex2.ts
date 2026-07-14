import { defineHtml, html } from "elfui";

const code1 = `<elf-flex justify="flex-start"><elf-tag>flex-start</elf-tag></elf-flex>
<elf-flex justify="center"><elf-tag>center</elf-tag></elf-flex>
<elf-flex justify="flex-end"><elf-tag>flex-end</elf-tag></elf-flex>
<elf-flex justify="space-between"><elf-tag>左</elf-tag><elf-tag>中</elf-tag><elf-tag>右</elf-tag></elf-flex>
<elf-flex justify="space-around"><elf-tag>A</elf-tag><elf-tag>B</elf-tag><elf-tag>C</elf-tag></elf-flex>`;

const code2 = `<elf-flex align="flex-start" gap="md">
  <elf-button size="sm">sm</elf-button>
  <elf-button size="md">md</elf-button>
  <elf-button size="lg">lg</elf-button>
</elf-flex>
<elf-flex align="center" gap="md">
  <elf-button size="sm">sm</elf-button>
  <elf-button size="md">md</elf-button>
  <elf-button size="lg">lg</elf-button>
</elf-flex>
<elf-flex align="flex-end" gap="md">
  <elf-button size="sm">sm</elf-button>
  <elf-button size="md">md</elf-button>
  <elf-button size="lg">lg</elf-button>
</elf-flex>`;

const code3 = `<elf-flex wrap gap="md" align="stretch" fill>
  <article style="flex:1 1 220px">统计卡片</article>
  <article style="flex:1 1 220px">统计卡片</article>
  <article style="flex:1 1 220px">统计卡片</article>
</elf-flex>`;

const PageFlexEx2 = defineHtml(html`
  <h2>主轴对齐</h2>
  <elf-playground title="justify" :code="code1">
    <div style="width: 100%; display: flex; flex-direction: column; gap: 8px">
      <elf-flex justify="flex-start" style="background: var(--elf-bg-overlay); padding: 4px"
        ><elf-tag>flex-start</elf-tag></elf-flex
      >
      <elf-flex justify="center" style="background: var(--elf-bg-overlay); padding: 4px"
        ><elf-tag>center</elf-tag></elf-flex
      >
      <elf-flex justify="flex-end" style="background: var(--elf-bg-overlay); padding: 4px"
        ><elf-tag>flex-end</elf-tag></elf-flex
      >
      <elf-flex justify="space-between" style="background: var(--elf-bg-overlay); padding: 4px"
        ><elf-tag>左</elf-tag><elf-tag>中</elf-tag><elf-tag>右</elf-tag></elf-flex
      >
      <elf-flex justify="space-around" style="background: var(--elf-bg-overlay); padding: 4px"
        ><elf-tag>A</elf-tag><elf-tag>B</elf-tag><elf-tag>C</elf-tag></elf-flex
      >
    </div>
  </elf-playground>

  <h2>交叉轴对齐</h2>
  <elf-playground title="align" :code="code2">
    <div style="width: 100%; display: flex; flex-direction: column; gap: 8px">
      <elf-flex
        align="flex-start"
        gap="md"
        style="background: var(--elf-bg-overlay); padding: 4px; height: 80px"
      >
        <elf-button size="sm">sm</elf-button><elf-button size="md">md</elf-button
        ><elf-button size="lg">lg</elf-button>
      </elf-flex>
      <elf-flex
        align="center"
        gap="md"
        style="background: var(--elf-bg-overlay); padding: 4px; height: 80px"
      >
        <elf-button size="sm">sm</elf-button><elf-button size="md">md</elf-button
        ><elf-button size="lg">lg</elf-button>
      </elf-flex>
      <elf-flex
        align="flex-end"
        gap="md"
        style="background: var(--elf-bg-overlay); padding: 4px; height: 80px"
      >
        <elf-button size="sm">sm</elf-button><elf-button size="md">md</elf-button
        ><elf-button size="lg">lg</elf-button>
      </elf-flex>
    </div>
  </elf-playground>

  <h2>响应式换行</h2>
  <elf-playground title="类似 Vuetify 的流式卡片行" :code=${code3}>
    <elf-flex wrap gap="md" align="stretch" fill style="width:100%">
      <article style="flex:1 1 220px;padding:20px;border:1px solid var(--elf-border);border-radius:14px;background:var(--elf-bg-paper)"><small style="color:var(--elf-text-secondary)">今日访问</small><strong style="display:block;margin-top:8px;font-size:28px">12,480</strong></article>
      <article style="flex:1 1 220px;padding:20px;border:1px solid var(--elf-border);border-radius:14px;background:var(--elf-bg-paper)"><small style="color:var(--elf-text-secondary)">活跃项目</small><strong style="display:block;margin-top:8px;font-size:28px">36</strong></article>
      <article style="flex:1 1 220px;padding:20px;border:1px solid var(--elf-border);border-radius:14px;background:var(--elf-bg-paper)"><small style="color:var(--elf-text-secondary)">待处理</small><strong style="display:block;margin-top:8px;font-size:28px">8</strong></article>
    </elf-flex>
  </elf-playground>
`);

export { PageFlexEx2 };
