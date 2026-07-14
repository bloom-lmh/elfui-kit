import { defineHtml, html, useRef } from "elfui";

const directiveRows = useRef(Array.from({ length: 8 }, (_, index) => index + 1));
const directiveLoading = useRef(false);
const directiveDone = useRef(false);

const directiveCode = `<div
  v-infinite-scroll=\${loadMore}
  :infiniteScrollDisabled=\${loading.value || done.value}
  infinite-scroll-distance="24"
  infinite-scroll-delay="120"
  infinite-scroll-immediate="false"
>
  <article v-for="item in rows.value" :key="item">动态 #{{ item }}</article>
</div>`;

const directiveScript = `const rows = useRef(Array.from({ length: 8 }, (_, index) => index + 1));
const loading = useRef(false);
const done = useRef(false);

const loadMore = () => {
  if (loading.value || done.value) return;
  loading.set(true);
  setTimeout(() => {
    const next = Array.from({ length: 4 }, (_, index) => rows.value.length + index + 1);
    rows.set([...rows.value, ...next]);
    done.set(rows.value.length >= 20);
    loading.set(false);
  }, 300);
};`;

const loadMore = (): void => {
  if (directiveLoading.value || directiveDone.value) return;
  directiveLoading.set(true);
  window.setTimeout(() => {
    const next = Array.from({ length: 4 }, (_, index) => directiveRows.value.length + index + 1);
    directiveRows.set([...directiveRows.value, ...next]);
    directiveDone.set(directiveRows.value.length >= 20);
    directiveLoading.set(false);
  }, 300);
};

const directiveStatus = (): string => {
  if (directiveDone.value) return `已加载全部 ${directiveRows.value.length} 条`;
  if (directiveLoading.value) return "正在加载…";
  return `已加载 ${directiveRows.value.length} / 20 条`;
};

const PageInfiniteScrollEx3 = defineHtml(html`
  <h2>指令模式</h2>
  <elf-playground title="v-infinite-scroll 用于任意滚动容器" :code=${directiveCode} :script=${directiveScript}>
    <span slot="status" class="demo-state">{{ directiveStatus() }}</span>
    <div
      v-infinite-scroll=${loadMore}
      :infiniteScrollDisabled=${directiveLoading.value || directiveDone.value}
      infinite-scroll-distance="24"
      infinite-scroll-delay="120"
      infinite-scroll-immediate="false"
      style="width:100%;max-width:680px;height:260px;overflow:auto;padding:10px;border:1px solid var(--elf-border);border-radius:14px;background:var(--elf-bg-paper);scrollbar-width:thin"
    >
      <article
        v-for="item in directiveRows.value"
        :key="item"
        style="display:flex;align-items:center;min-height:54px;padding:0 16px;border-bottom:1px solid var(--elf-divider)"
      >
        <strong>动态 #{{ item }}</strong>
        <span style="margin-left:auto;color:var(--elf-text-secondary);font-size:13px">指令容器</span>
      </article>
      <p v-if=${directiveLoading.value} style="margin:0;padding:16px;text-align:center;color:var(--elf-text-secondary)">正在加载…</p>
      <p v-if=${directiveDone.value} style="margin:0;padding:16px;text-align:center;color:var(--elf-text-secondary)">没有更多数据</p>
    </div>
  </elf-playground>
`);

export { PageInfiniteScrollEx3 };
