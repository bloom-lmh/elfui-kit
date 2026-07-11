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
`);

export { PageFlexEx2 };
