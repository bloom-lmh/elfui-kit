import { defineHtml, html, useRef } from "elfui";

const rows = useRef(["任务 1", "任务 2", "任务 3", "任务 4", "任务 5", "任务 6"]);
const loading = useRef(false);
const disabled = useRef(false);

const code1 = `<elf-infinite-scroll
  :distance=\${24}
  :loading=\${loading}
  @load=\${loadMore}
>
  <div v-for="row in rows" :key="row" class="demo-row">{{ row }}</div>
  <p v-if="loading">加载中...</p>
</elf-infinite-scroll>`;

const script1 = `const rows = useRef(["任务 1", "任务 2", "任务 3", "任务 4", "任务 5", "任务 6"]);
const loading = useRef(false);

const loadMore = () => {
  if (loading.value) return;
  loading.set(true);
  setTimeout(() => {
    const next = Array.from({ length: 4 }, (_, index) => \`任务 \${rows.value.length + index + 1}\`);
    rows.set([...rows.value, ...next]);
    loading.set(false);
  }, 300);
};`;

const code2 = `<elf-infinite-scroll disabled immediate @load=\${loadMore}>
  <div class="demo-row">禁用状态不会触发 load</div>
</elf-infinite-scroll>`;

const loadMore = (): void => {
  if (loading.value || disabled.value) return;
  loading.set(true);
  window.setTimeout(() => {
    const start = rows.value.length + 1;
    const next = Array.from({ length: 4 }, (_, index) => `任务 ${start + index}`);
    rows.set([...rows.value, ...next]);
    loading.set(false);
    if (rows.value.length >= 18) disabled.set(true);
  }, 300);
};

const PageInfiniteScroll = defineHtml(html`
  <elf-container>
    <h1>InfiniteScroll 无限滚动</h1>
    <p>滚动到底部附近时触发 load 事件，适合列表追加加载。</p>

    <elf-playground title="distance / loading / load" :code=${code1} :script=${script1}>
      <elf-infinite-scroll
        :distance=${24}
        :loading=${loading}
        :disabled=${disabled}
        @load=${loadMore}
      >
        <div v-for="row in rows.value" :key="row" class="demo-row">{{ row }}</div>
        <p v-if=${loading.value} class="demo-state">加载中...</p>
        <p v-if=${disabled.value} class="demo-state">已加载全部</p>
      </elf-infinite-scroll>
    </elf-playground>

    <elf-playground title="disabled / immediate" :code=${code2}>
      <elf-infinite-scroll disabled immediate @load=${loadMore}>
        <div class="demo-row">禁用状态不会触发 load</div>
      </elf-infinite-scroll>
    </elf-playground>
  </elf-container>
`);

export { PageInfiniteScroll };
