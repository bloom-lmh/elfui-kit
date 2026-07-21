import { defineHtml, html, useRef } from "@elfui/core";

const code1 = `<elf-card title="卡片标题" subtitle="副标题说明">
  <p>这是一张 elevated 变体卡片，默认带阴影。</p>
  <p style="color:var(--elf-text-secondary);margin-top:8px">支持标题、副标题、插槽内容。</p>
</elf-card>`;

const code2 = `<elf-card variant="elevated" title="浮层卡片">...</elf-card>
<elf-card variant="outlined" title="描边卡片">...</elf-card>
<elf-card variant="tonal" title="柔和卡片">...</elf-card>
<elf-card variant="flat" title="平面卡片" density="compact">...</elf-card>`;

const code3 = `<elf-card variant="outlined" clickable title="点击我" subtitle="悬浮时提升层级" @click=\${handle}>
  <p>整张卡片可点击</p>
  <template #footer>
    <elf-button variant="text" color="primary" size="sm">查看</elf-button>
  </template>
</elf-card>`;

const code4 = `<elf-card header="订单摘要" footer="共计 ¥128.00" shadow="hover">
  <p>Header / footer prop 也可以分别由同名 slot 覆盖。</p>
</elf-card>`;

const script3 = `const clickCount = useRef(0);

const handle = () => {
  clickCount.set(clickCount.value + 1);
};`;

const staticScript = `// 纯展示案例，无需额外状态。`;

const clickCount = useRef(0);

const handle = (): void => {
  clickCount.set(clickCount.value + 1);
};

const PageCardEx1 = defineHtml(html`
  <h2>基础</h2>
  <elf-playground title="标题 + 副标题 + 内容" :code=${code1} :script=${staticScript}>
    <elf-card title="卡片标题" subtitle="副标题说明" style="max-width:400px">
      <p>这是一张 elevated 变体卡片，默认带阴影。</p>
      <p style="color:var(--elf-text-secondary);margin-top:8px">支持标题、副标题、插槽内容。</p>
    </elf-card>
  </elf-playground>

  <h2>Surface 变体</h2>
  <elf-playground title="elevated / outlined / tonal / flat" :code=${code2} :script=${staticScript}>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;width:100%;max-width:880px">
      <elf-card variant="elevated" title="浮层卡片">
        <p>使用克制的一级阴影表达内容层级。</p>
      </elf-card>
      <elf-card variant="outlined" title="描边卡片">
        <p>使用清晰边界承载同级信息。</p>
      </elf-card>
      <elf-card variant="tonal" title="柔和卡片">
        <p>使用主题色浅层填充突出关联内容。</p>
      </elf-card>
      <elf-card variant="flat" density="compact" title="平面卡片">
        <p>紧凑密度适合侧栏和小型信息块。</p>
      </elf-card>
    </div>
  </elf-playground>

  <h2>可点击卡片</h2>
  <elf-playground title="悬浮提升层级，不改变布局位置" :code=${code3} :script=${script3}>
    <elf-card
      variant="outlined"
      clickable
      title="点击我"
      subtitle="悬浮时提升层级"
      style="max-width:360px"
      @click=${handle}
    >
      <p>整张卡片可点击，悬浮时只调整边界与阴影，不产生位置跳动。</p>
      <template #footer>
        <elf-button variant="text" color="primary" size="sm">了解详情</elf-button>
      </template>
    </elf-card>
    <span slot="status" class="demo-state">点击次数：{{ clickCount }}</span>
  </elf-playground>

  <h2>Element Plus 兼容 API</h2>
  <elf-playground title="header / footer / shadow" :code=${code4} :script=${staticScript}>
    <elf-card header="订单摘要" footer="共计 ¥128.00" shadow="hover" style="max-width:360px">
      <p style="color:var(--elf-text-secondary)">Header / footer prop 也可以分别由同名 slot 覆盖。</p>
    </elf-card>
  </elf-playground>
`);

export { PageCardEx1 };
