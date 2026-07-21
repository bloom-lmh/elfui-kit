import { defineHtml, defineStyle, html, useRef } from "elfui";

const favorite = useRef(false);

const toggleFavorite = (): void => favorite.set(!favorite.value);

const code = `<elf-card class="destination-card" title="Misty Mountains" image-height="176px">
  <img slot="cover" src="..." alt="云雾中的群山" />
  <button slot="extra" aria-label="收藏">
    <svg viewBox="0 0 24 24"><path d="..." /></svg>
  </button>
  <p class="destination-date">
    <svg viewBox="0 0 24 24"><path d="..." /></svg>
    2025 年 12 月 1 日
  </p>
</elf-card>`;

const script = `const favorite = useRef(false);

const toggleFavorite = () => favorite.set(!favorite.value);`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .destination-card { width:min(100%,376px); border-radius:10px; }
  .destination-cover { padding:10px 10px 0; border-radius:10px; object-fit:cover; }
  .favorite { display:grid; width:34px; height:34px; padding:0; place-items:center; border:0; border-radius:50%; background:transparent; color:var(--elf-text-secondary); cursor:pointer; }
  .favorite:hover, .favorite:focus-visible, .favorite.is-active { color:var(--elf-error); background:color-mix(in srgb,var(--elf-error) 9%,transparent); outline:none; }
  .favorite svg, .destination-date svg { width:20px; height:20px; fill:currentColor; }
  .favorite:not(.is-active) svg { fill:none; stroke:currentColor; stroke-width:1.8; }
  .destination-date { display:flex; align-items:center; gap:8px; margin:0; color:var(--elf-text-secondary); }
  .destination-date svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
`);

const PageCardEx3 = defineHtml(html`
  <h2>旅行图片卡片</h2>
  <elf-playground title="内嵌封面 + 收藏操作 + 日期信息" :code=${code} :script=${script}>
    <elf-card class="destination-card" title="Misty Mountains" image-height="176px">
      <img
        slot="cover"
        class="destination-cover"
        src="https://picsum.photos/seed/misty-mountains/720/320"
        alt="云雾中的群山"
      />
      <button
        slot="extra"
        type="button"
        :class=${{ favorite: true, "is-active": favorite.value }}
        :aria-pressed=${favorite.value ? "true" : "false"}
        aria-label="收藏 Misty Mountains"
        @click=${toggleFavorite}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 10.55 19.18C5.4 14.5 2 11.42 2 7.63 2 4.55 4.42 2.13 7.5 2.13c1.74 0 3.41.81 4.5 2.09a6.03 6.03 0 0 1 4.5-2.09c3.08 0 5.5 2.42 5.5 5.5 0 3.79-3.4 6.87-8.55 11.56Z" /></svg>
      </button>
      <p class="destination-date">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3m10-3v3M3.5 9h17M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
        2025 年 12 月 1 日
      </p>
    </elf-card>
    <span slot="status" class="demo-state">收藏：{{ favorite ? "是" : "否" }}</span>
  </elf-playground>
`);

export { PageCardEx3 };
