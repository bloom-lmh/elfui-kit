import { defineHtml, html } from "elfui";

const code1 = `<elf-grid gap="md" style="width: 100%">
  <elf-grid-item span="6">
    <div>span 6</div>
  </elf-grid-item>
  <elf-grid-item span="6">
    <div>span 6</div>
  </elf-grid-item>
</elf-grid>`;

const code2 = `<elf-grid gap="md" style="width: 100%">
  <elf-grid-item span="4">
    <div>span 4</div>
  </elf-grid-item>
  <elf-grid-item span="4">
    <div>span 4</div>
  </elf-grid-item>
  <elf-grid-item span="4">
    <div>span 4</div>
  </elf-grid-item>
</elf-grid>`;

const script = `// span 表示子项占用的栅格列数。`;

const PageGridEx1 = defineHtml(html`
  <h2>等分</h2>
  <elf-playground title="2 列等分" :code=${code1} :script=${script}>
    <elf-grid gap="md" style="width: 100%">
      <elf-grid-item span="6"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); text-align: center; border-radius: 4px"
        >
          span 6
        </div></elf-grid-item
      >
      <elf-grid-item span="6"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); text-align: center; border-radius: 4px"
        >
          span 6
        </div></elf-grid-item
      >
    </elf-grid>
  </elf-playground>

  <h2>三等分</h2>
  <elf-playground title="3 列" :code=${code2} :script=${script}>
    <elf-grid gap="md" style="width: 100%">
      <elf-grid-item span="4"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); text-align: center; border-radius: 4px"
        >
          span 4
        </div></elf-grid-item
      >
      <elf-grid-item span="4"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); text-align: center; border-radius: 4px"
        >
          span 4
        </div></elf-grid-item
      >
      <elf-grid-item span="4"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); text-align: center; border-radius: 4px"
        >
          span 4
        </div></elf-grid-item
      >
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx1 };
