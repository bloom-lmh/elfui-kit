import { defineHtml, html, useRef } from "elfui";

const progress = useRef(48);
const transitionDuration = useRef(0.6);

const setProgress = (value: number): void => {
  progress.set(Math.min(100, Math.max(0, value)));
};

const inc = (): void => setProgress(progress.value + 12);

const dec = (): void => setProgress(progress.value - 12);

const lineCode = `<elf-progress :percentage=\${progress.value} :transition-duration=\${transitionDuration.value} />
<elf-progress
  :percentage=\${progress.value}
  :transition-duration=\${transitionDuration.value}
  text-inside
  stroke-width="20"
/>
<elf-button size="sm" @click=\${dec}>减少</elf-button>
<elf-button size="sm" type="primary" @click=\${inc}>增加</elf-button>`;

const lineScript = `const progress = useRef(48);
const transitionDuration = useRef(0.6);

const setProgress = (value: number): void => {
  progress.set(Math.min(100, Math.max(0, value)));
};

const inc = (): void => setProgress(progress.value + 12);
const dec = (): void => setProgress(progress.value - 12);`;

const onSpeedChange = (event: Event): void => {
  transitionDuration.set(Number((event.target as HTMLSelectElement).value));
};

const PageProgressEx1 = defineHtml(html`
  <h2>条形进度</h2>
  <elf-playground title="基础、内部文字与增长速度" :code=${lineCode} :script=${lineScript}>
    <div style="display:grid;gap:16px;width:100%;max-width:520px">
      <elf-progress :percentage=${progress.value} :transitionDuration=${transitionDuration.value}></elf-progress>
      <elf-progress :percentage=${progress.value} :transitionDuration=${transitionDuration.value} text-inside stroke-width="20"></elf-progress>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <elf-button size="sm" @click=${dec}>减少</elf-button>
        <elf-button size="sm" type="primary" @click=${inc}>增加</elf-button>
        <label>
          增长速度：
          <select @change=${onSpeedChange}>
            <option value="0.2">快速（0.2 秒）</option>
            <option value="0.6" selected>标准（0.6 秒）</option>
            <option value="1.5">舒缓（1.5 秒）</option>
          </select>
        </label>
        <span slot="status" class="demo-state">{{ progress }}%</span>
      </div>
    </div>
  </elf-playground>
`);

export { PageProgressEx1 };
