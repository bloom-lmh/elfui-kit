import { defineHtml, html } from "elfui";

const code1 = `<elf-grid gap="md" style="width: 100%">
  <elf-grid-item span="8">
    <div>主区域 (span 8)</div>
  </elf-grid-item>
  <elf-grid-item span="4">
    <div>侧栏 (span 4)</div>
  </elf-grid-item>
</elf-grid>`;

const code2 = `<elf-grid gap="xs">...</elf-grid>
<elf-grid gap="md">...</elf-grid>
<elf-grid gap="xl">...</elf-grid>`;

const code3 = `<elf-grid columns="24" gap="sm" style="width: 100%">
  <elf-grid-item span="6">
    <div>6/24</div>
  </elf-grid-item>
  <elf-grid-item span="12">
    <div>12/24</div>
  </elf-grid-item>
  <elf-grid-item span="6">
    <div>6/24</div>
  </elf-grid-item>
</elf-grid>`;

const PageGridEx2 = defineHtml(html`
  <h2>不等分</h2>
  <elf-playground title="左侧 8 + 右侧 4" :code="code1">
    <elf-grid gap="md" style="width: 100%">
      <elf-grid-item span="8"
        ><div
          style="background: rgba(25, 118, 210, 0.1); padding: var(--elf-space-3); border-radius: 4px"
        >
          主区域 (span 8)
        </div></elf-grid-item
      >
      <elf-grid-item span="4"
        ><div
          style="background: var(--elf-bg-overlay); padding: var(--elf-space-3); border-radius: 4px"
        >
          侧栏 (span 4)
        </div></elf-grid-item
      >
    </elf-grid>
  </elf-playground>

  <h2>不同间距</h2>
  <elf-playground title="gap" :code="code2">
    <div style="width: 100%; display: flex; flex-direction: column; gap: 8px">
      <elf-grid gap="xs"
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xs
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xs
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xs
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xs
          </div></elf-grid-item
        ></elf-grid
      >
      <elf-grid gap="md"
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            md
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            md
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            md
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            md
          </div></elf-grid-item
        ></elf-grid
      >
      <elf-grid gap="xl"
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xl
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xl
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xl
          </div></elf-grid-item
        ><elf-grid-item span="3"
          ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
            xl
          </div></elf-grid-item
        ></elf-grid
      >
    </div>
  </elf-playground>

  <h2>自定义列数</h2>
  <elf-playground title="columns=24（精细栅格）" :code="code3">
    <elf-grid columns="24" gap="sm" style="width: 100%">
      <elf-grid-item span="6"
        ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
          6/24
        </div></elf-grid-item
      >
      <elf-grid-item span="12"
        ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
          12/24
        </div></elf-grid-item
      >
      <elf-grid-item span="6"
        ><div style="background: var(--elf-bg-overlay); padding: 6px; text-align: center">
          6/24
        </div></elf-grid-item
      >
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx2 };
