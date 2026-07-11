import { defineHtml, html, useRef } from "elfui";

const loading = useRef(true);

const code1 = `<elf-loading :loading=\${loading} text="加载组件数据中">
  <div class="demo-panel">局部内容区域</div>
</elf-loading>
<elf-button @click=\${toggle}>切换 loading</elf-button>`;

const script1 = `const loading = useRef(true);

const toggle = () => {
  loading.set(!loading.value);
};`;

const code2 = `<elf-loading
  loading
  text="处理中"
  background="rgba(24, 144, 255, 0.12)"
>
  <div class="demo-panel">自定义遮罩背景</div>
</elf-loading>`;

const code3 = `<elf-loading fullscreen loading text="全屏加载" />`;

const toggle = (): void => {
  loading.set(!loading.value);
};

const PageLoading = defineHtml(html`
  <elf-container>
    <h1>Loading 加载</h1>
    <p>给局部内容或全屏状态添加加载遮罩，支持文案和背景色。</p>

    <elf-playground title="局部加载 / 受控" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;max-width:520px">
        <elf-loading :loading=${loading} text="加载组件数据中">
          <div
            style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
          >
            局部内容区域
          </div>
        </elf-loading>
        <elf-button @click=${toggle}>切换 loading</elf-button>
      </div>
    </elf-playground>

    <elf-playground title="background" :code=${code2}>
      <elf-loading loading text="处理中" background="rgba(24, 144, 255, 0.12)">
        <div
          style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
        >
          自定义遮罩背景
        </div>
      </elf-loading>
    </elf-playground>

    <elf-playground title="fullscreen" :code=${code3}>
      <elf-loading fullscreen loading text="全屏加载"></elf-loading>
    </elf-playground>
  </elf-container>
`);

export { PageLoading };
