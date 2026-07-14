import { defineHtml, html, useRef } from "elfui";

interface FeedItem {
  id: number;
  title: string;
  summary: string;
  meta: string;
  initials: string;
}

const createRows = (start: number, count: number): FeedItem[] =>
  Array.from({ length: count }, (_, index) => {
    const id = start + index;
    return {
      id,
      title: `项目更新 #${id}`,
      summary: id % 2 ? "设计稿已同步到团队空间，等待你查看并留下反馈。" : "本周的任务状态已更新，相关成员会收到通知。",
      meta: `${id + 2} 分钟前 · 产品协作`,
      initials: ["林", "周", "陈", "许"][id % 4]!
    };
  });

const rows = useRef(createRows(1, 9));

const loading = useRef(false);

const disabled = useRef(false);

const code2 = `<elf-infinite-scroll disabled immediate height="160px" @load="loadMore">
  <div>禁用状态不会触发 load</div>
</elf-infinite-scroll>`;

const loadMore = (): void => {
  if (loading.value || disabled.value) return;
  loading.set(true);
  window.setTimeout(() => {
    rows.set([...rows.value, ...createRows(rows.value.length + 1, 4)]);
    loading.set(false);
    if (rows.value.length >= 25) disabled.set(true);
  }, 450);
};

const PageInfiniteScrollEx2 = defineHtml(html`
<elf-playground title="禁用与立即检查" :code=${code2}>
      <elf-infinite-scroll disabled immediate height="160px" @load=${loadMore} style="width:100%;max-width:920px;border:1px dashed var(--elf-border);border-radius:12px">
        <div style="padding:20px;color:var(--elf-text-secondary)">禁用后不会触发 load，适合没有更多数据或请求失败后的状态。</div>
      </elf-infinite-scroll>
    </elf-playground>
`);

export { PageInfiniteScrollEx2 };
