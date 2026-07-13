import { defineHtml, html, useRef } from "elfui";

const progress = useRef(48);

const setProgress = (value: number): void => {
  progress.set(Math.min(100, Math.max(0, value)));
};

const inc = (): void => setProgress(progress.value + 12);

const dec = (): void => setProgress(progress.value - 12);

const lineCode = `<elf-progress :percentage="progress" />
<elf-progress :percentage="progress" text-inside stroke-width="20" />`;

const PageProgressEx1 = defineHtml(html`
  <h2>条形进度</h2>
  <elf-playground title="基础与内部文字" :code="lineCode">
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress :percentage="progress"></elf-progress>
      <elf-progress :percentage="progress" text-inside stroke-width="20"></elf-progress>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <elf-button size="sm" @click="dec">减少</elf-button>
        <elf-button size="sm" type="primary" @click="inc">增加</elf-button>
        <span class="demo-state">{{ progress }}%</span>
      </div>
    </div>
  </elf-playground>
`);

export { PageProgressEx1 };
