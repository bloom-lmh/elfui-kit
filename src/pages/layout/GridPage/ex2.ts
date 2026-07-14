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

const code4 = `<elf-grid auto-fit min-column-width="240px" gap="md">
  <article>自动适应可用宽度</article>
  <article>无需手动计算 span</article>
  <article>窄屏自动换行</article>
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

  <h2>自动响应式网格</h2>
  <elf-playground title="auto-fit / min-column-width" :code=${code4}>
    <elf-grid auto-fit min-column-width="240px" gap="md" style="width:100%">
      <article style="min-height:120px;padding:20px;border-radius:14px;background:color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper))"><strong>团队空间</strong><p style="color:var(--elf-text-secondary)">自动适应可用宽度。</p></article>
      <article style="min-height:120px;padding:20px;border-radius:14px;background:color-mix(in srgb,var(--elf-success) 10%,var(--elf-bg-paper))"><strong>发布状态</strong><p style="color:var(--elf-text-secondary)">无需手动计算 span。</p></article>
      <article style="min-height:120px;padding:20px;border-radius:14px;background:color-mix(in srgb,var(--elf-warning) 12%,var(--elf-bg-paper))"><strong>资源用量</strong><p style="color:var(--elf-text-secondary)">窄屏自动换行。</p></article>
    </elf-grid>
  </elf-playground>
`);

export { PageGridEx2 };
