import { defineHtml, html } from "@elfui/core";

const code2 = `<elf-infinite-scroll disabled immediate height="160px" @load=\${loadMore}>
  <div>禁用状态不会触发 load</div>
</elf-infinite-scroll>`;

const script2 = `const loadMore = () => {
  // disabled 状态下不会触发。
};`;

const loadMore = (): void => undefined;

const PageInfiniteScrollEx2 = defineHtml(html`
<elf-playground title="禁用与立即检查" :code=${code2} :script=${script2}>
      <elf-infinite-scroll disabled immediate height="160px" @load=${loadMore} style="width:100%;max-width:920px;border:1px dashed var(--elf-border);border-radius:12px">
        <div style="padding:20px;color:var(--elf-text-secondary)">禁用后不会触发 load，适合没有更多数据或请求失败后的状态。</div>
      </elf-infinite-scroll>
    </elf-playground>
`);

export { PageInfiniteScrollEx2 };
