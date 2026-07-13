import { defineHtml, html, useRef } from "elfui";

const createRows = (start: number, count: number): string[] =>
  Array.from({ length: count }, (_, index) => `任务 ${start + index}`);

const rows = useRef(createRows(1, 10));
const loading = useRef(false);
const disabled = useRef(false);

const code1 = `<elf-infinite-scroll
  height="240px"
  :distance="24"
  :loading="loading"
  :disabled="disabled"
  @load="loadMore"
>
  <div v-for="row in rows" :key="row" class="demo-row">{{ row }}</div>
  <p v-if="loading">加载中…</p>
</elf-infinite-scroll>`;

const script1 = `const rows = useRef(Array.from({ length: 10 }, (_, index) => \`任务 \${index + 1}\`));
const loading = useRef(false);

const loadMore = () => {
  if (loading.value) return;
  loading.set(true);
  setTimeout(() => {
    const start = rows.value.length + 1;
    rows.set([...rows.value, ...Array.from({ length: 4 }, (_, index) => \`任务 \${start + index}\`)]);
    loading.set(false);
  }, 300);
};`;

const code2 = `<elf-infinite-scroll disabled immediate height="160px" @load="loadMore">
  <div class="demo-row">禁用状态不会触发 load</div>
</elf-infinite-scroll>`;

const loadMore = (): void => {
  if (loading.value || disabled.value) return;
  loading.set(true);
  window.setTimeout(() => {
    rows.set([...rows.value, ...createRows(rows.value.length + 1, 4)]);
    loading.set(false);
    if (rows.value.length >= 22) disabled.set(true);
  }, 300);
};

const PageInfiniteScroll = defineHtml(html`
  <elf-container>
    <h1>InfiniteScroll 无限滚动</h1>
    <p>滚动到列表底部附近时触发加载事件，适合持续追加数据。</p>

    <elf-playground title="滚动距离、加载状态与加载事件" :code=${code1} :script=${script1}>
      <elf-infinite-scroll
        height="240px"
        :distance=${24}
        :loading=${loading}
        :disabled=${disabled}
        @load=${loadMore}
      >
        <div
          v-for="row in rows.value"
          :key="row"
          style="box-sizing:border-box;min-height:52px;padding:14px 16px;border-bottom:1px solid var(--elf-border)"
        >
          {{ row }}
        </div>
        <p v-if=${loading.value} style="padding:12px 16px;color:var(--elf-text-secondary)">加载中…</p>
        <p v-if=${disabled.value} style="padding:12px 16px;color:var(--elf-text-secondary)">已加载全部任务</p>
      </elf-infinite-scroll>
    </elf-playground>

    <elf-playground title="禁用与立即加载" :code=${code2}>
      <elf-infinite-scroll disabled immediate height="160px" @load=${loadMore}>
        <div style="padding:16px">禁用状态不会触发加载事件</div>
      </elf-infinite-scroll>
    </elf-playground>
  </elf-container>
`);

export { PageInfiniteScroll };
