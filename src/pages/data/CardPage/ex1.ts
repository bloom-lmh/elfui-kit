import { defineHtml, html, useRef } from "elfui";

const code1 = `<elf-card title="卡片标题" subtitle="副标题说明">
  <p>这是一张 elevated 变体卡片，默认带阴影。</p>
  <p style="color:var(--elf-text-secondary);margin-top:8px">支持标题、副标题、插槽内容。</p>
</elf-card>`;

const code2 = `<elf-card variant="elevated" title="Elevated">...</elf-card>
<elf-card variant="outlined" title="Outlined">...</elf-card>
<elf-card variant="filled" title="Filled">...</elf-card>`;

const code3 = `<elf-card variant="outlined" clickable title="点击我" subtitle="hover 时上升 + 阴影" @click=\${handle}>
  <p>整张卡片可点击</p>
  <template #footer>
    <elf-button variant="text" color="primary" size="sm">查看</elf-button>
  </template>
</elf-card>`;

const script3 = `const clickCount = useRef(0);

const handle = () => {
  clickCount.set(clickCount.value + 1);
};`;

const clickCount = useRef(0);

const handle = (): void => {
  clickCount.set(clickCount.value + 1);
};

const PageCardEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="标题 + 副标题 + 内容" :code=${code1}>
    <elf-card title="卡片标题" subtitle="副标题说明" style="max-width:400px">
      <p>这是一张 elevated 变体卡片，默认带阴影。</p>
      <p style="color:var(--elf-text-secondary);margin-top:8px">支持标题、副标题、插槽内容。</p>
    </elf-card>
  </elf-playground>

  <h2>MD3 三种变体</h2>
  <elf-playground title="elevated / outlined / filled" :code=${code2}>
    <div style="display:flex;gap:16px;width:100%;max-width:720px">
      <elf-card variant="elevated" title="Elevated" style="flex:1">
        <p style="font-size:13px;color:var(--elf-text-secondary)">Material Design 3 默认阴影卡片</p>
      </elf-card>
      <elf-card variant="outlined" title="Outlined" style="flex:1">
        <p style="font-size:13px;color:var(--elf-text-secondary)">仅 outline 边框，无阴影</p>
      </elf-card>
      <elf-card variant="filled" title="Filled" style="flex:1">
        <p style="font-size:13px;color:var(--elf-text-secondary)">浅灰背景，层次柔和</p>
      </elf-card>
    </div>
  </elf-playground>

  <h2>可点击卡片</h2>
  <elf-playground title="hover 时上升 2px + shadow-2" :code=${code3} :script=${script3}>
    <elf-card
      variant="outlined"
      clickable
      title="点击我"
      subtitle="悬浮有动效"
      style="max-width:360px"
      @click=${handle}
    >
      <p style="color:var(--elf-text-secondary)">整张卡片可点击，hover 时向上浮起并增加阴影。</p>
      <template #footer>
        <elf-button variant="text" color="primary" size="sm">了解详情</elf-button>
      </template>
    </elf-card>
    <span class="demo-state">点击次数：{{ clickCount }}</span>
  </elf-playground>
`);

export { PageCardEx1 };
