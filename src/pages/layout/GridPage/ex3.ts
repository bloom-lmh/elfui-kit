import { defineHtml, html } from "elfui";

const mobileColumns = 12;
const desktopColumns = { span: 4, offset: 2 };

const code1 = `<elf-grid gutter="16" justify="center" align="center">
  <elf-grid-item span="3"><article>居中</article></elf-grid-item>
  <elf-grid-item span="3"><article>对齐</article></elf-grid-item>
</elf-grid>`;

const code2 = `<elf-grid columns="12" gutter="16">
  <elf-grid-item span="4" offset="2"><article>offset 2</article></elf-grid-item>
  <elf-grid-item span="4" push="1"><article>push 1</article></elf-grid-item>
  <elf-grid-item span="4" pull="1"><article>pull 1</article></elf-grid-item>
</elf-grid>`;

const code3 = `<elf-grid columns="12" gutter="16">
  <elf-grid-item span="12" :sm=\${mobileColumns} :md=\${desktopColumns}>
    <article>xs 12 / sm 12 / md 4 + offset 2</article>
  </elf-grid-item>
</elf-grid>`;

const script = `const mobileColumns = 12;
const desktopColumns = { span: 4, offset: 2 };`;

const cardStyle = "min-height:72px;padding:18px;border:1px solid var(--elf-border);border-radius:12px;background:var(--elf-bg-paper);box-sizing:border-box";

const PageGridEx3 = defineHtml(html`
  <h2>Row 兼容属性</h2>
  <elf-playground title="gutter / justify / align" :code=${code1} :script=${script}>
    <elf-grid gutter="16" justify="center" align="center" style="width:100%;min-height:120px">
      <elf-grid-item span="3"><article style=${cardStyle}>居中</article></elf-grid-item>
      <elf-grid-item span="3"><article style=${cardStyle}>垂直对齐</article></elf-grid-item>
    </elf-grid>
  </elf-playground>

  <h2>偏移与响应式</h2>
  <elf-playground title="offset / push / pull" :code=${code2} :script=${script}>
    <div style="display:grid;width:100%;gap:16px">
      <elf-grid columns="12" gutter="16">
        <elf-grid-item span="4" offset="2"><article style=${cardStyle}>offset 2</article></elf-grid-item>
      </elf-grid>
      <elf-grid columns="12" gutter="16">
        <elf-grid-item span="4" push="1"><article style=${cardStyle}>push 1</article></elf-grid-item>
        <elf-grid-item span="4" pull="1"><article style=${cardStyle}>pull 1</article></elf-grid-item>
      </elf-grid>
    </div>
  </elf-playground>

  <elf-playground title="xs / sm / md / lg / xl" :code=${code3} :script=${script}>
    <elf-grid columns="12" gutter="16" style="width:100%">
      <elf-grid-item span="12" :sm=${mobileColumns} :md=${desktopColumns} data-responsive-demo>
        <article style=${cardStyle}>窄屏 12 列；≥ 992px 时 4 列并偏移 2 列</article>
      </elf-grid-item>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx3 };
