import { defineHtml, html, useRef } from "elfui";

interface FeedItem {
  id: number;
  title: string;
  summary: string;
  meta: string;
  initials: string;
}

const TOTAL_ITEMS = 25;

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

const code1 = `<elf-infinite-scroll
  height="360px"
  :distance="32"
  :loading="loading"
  :disabled="disabled"
  @load="loadMore"
>
  <article v-for="item in rows" :key="item.id">...</article>
</elf-infinite-scroll>`;

const script1 = `const rows = useRef(createRows(1, 9));
const loading = useRef(false);
const disabled = useRef(false);

const loadMore = () => {
  if (loading.value || disabled.value) return;
  loading.set(true);
  setTimeout(() => {
    rows.set([...rows.value, ...createRows(rows.value.length + 1, 4)]);
    loading.set(false);
    if (rows.value.length >= 25) disabled.set(true);
  }, 450);
};`;

const loadMore = (): void => {
  if (loading.value || disabled.value) return;
  loading.set(true);
  window.setTimeout(() => {
    const remaining = TOTAL_ITEMS - rows.value.length;
    rows.set([...rows.value, ...createRows(rows.value.length + 1, Math.min(4, remaining))]);
    loading.set(false);
    if (rows.value.length >= TOTAL_ITEMS) disabled.set(true);
  }, 450);
};

const progressText = (): string => `已加载 ${rows.value.length} / 共 ${TOTAL_ITEMS} 条`;

const PageInfiniteScrollEx1 = defineHtml(html`
<elf-playground title="项目动态信息流" :code=${code1} :script=${script1}>
      <span slot="status" class="demo-state">{{ progressText() }}</span>
      <div style="width:100%;max-width:920px;border:1px solid var(--elf-border);border-radius:16px;overflow:hidden;background:var(--elf-bg-paper)">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--elf-divider)">
          <div><strong style="font-size:16px">项目动态</strong><span style="margin-left:8px;color:var(--elf-text-secondary);font-size:13px">向下滚动加载更多</span></div>
          <span style="color:var(--elf-primary);font-size:13px">滚动加载</span>
        </div>
        <elf-infinite-scroll height="360px" :distance=${32} :loading=${loading} :disabled=${disabled} @load=${loadMore}>
          <article
            v-for="item in rows.value"
            :key="item.id"
            style="display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:16px 20px;border-bottom:1px solid var(--elf-divider)"
          >
            <span style="display:grid;width:40px;height:40px;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--elf-primary) 14%,var(--elf-bg-paper));color:var(--elf-primary);font-weight:700">{{ item.initials }}</span>
            <span style="display:grid;gap:4px;min-width:0">
              <strong>{{ item.title }}</strong>
              <span style="color:var(--elf-text-secondary);line-height:1.55">{{ item.summary }}</span>
              <small style="color:var(--elf-text-disabled)">{{ item.meta }}</small>
            </span>
          </article>
          <p v-if=${loading.value} style="margin:0;padding:16px;text-align:center;color:var(--elf-text-secondary)">正在加载新的动态…</p>
          <p v-if=${disabled.value} style="margin:0;padding:16px;text-align:center;color:var(--elf-text-secondary)">已经到底了</p>
        </elf-infinite-scroll>
      </div>
    </elf-playground>
`);

export { PageInfiniteScrollEx1 };
