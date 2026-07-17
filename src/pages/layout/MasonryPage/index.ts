import { defineHtml, html } from "elfui";

const cards = [
  { title: "Design systems at scale", text: "A practical guide to tokens, component contracts, accessibility and cross-product governance.", tone: "primary", height: 220 },
  { title: "Release 0.8", text: "42 components passed visual regression and keyboard navigation checks.", tone: "success", height: 150 },
  { title: "Team notes", text: "Keep state together, keep methods together, and make templates structural.", tone: "warning", height: 190 },
  { title: "Performance", text: "VirtualList keeps ten thousand records responsive with a bounded DOM window.", tone: "info", height: 170 },
  { title: "Theme studio", text: "Material, Midnight, Forest and Sunset skins inherit through ThemeProvider without rewriting component CSS.", tone: "secondary", height: 240 },
  { title: "Internationalization", text: "LocaleProvider scopes messages and direction to any subtree.", tone: "primary", height: 145 },
  { title: "Layout primitives", text: "Use Flex for one-dimensional flow, Grid for precise two-dimensional structure, and Masonry for editorial collections.", tone: "success", height: 210 }
];

const cardStyle = (card: { tone: string; height: number }): string =>
  `min-height:${card.height}px;padding:22px;border:1px solid var(--elf-border);border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--elf-${card.tone}) 14%,var(--elf-bg-paper)),var(--elf-bg-paper) 62%);box-shadow:0 10px 30px rgba(0,0,0,.07)`;

const PageMasonry = defineHtml(html`
  <elf-container>
    <h1>Masonry 瀑布流</h1>
    <p>适合图片墙、灵感卡片和内容高度不一致的编辑型页面；宽度不足时会自动减少列数。</p>
    <elf-playground title="响应式内容画廊">
      <span slot="status" class="demo-state">最多 4 列 · 最小列宽 230px</span>
      <elf-masonry columns="4" min-column-width="230" gap="lg" style="width:100%">
        <article v-for="card in cards" :key="card.title" :style=${cardStyle(card)}>
          <small style="color:var(--elf-primary);font-weight:700;text-transform:uppercase;letter-spacing:.08em">{{ card.tone }}</small>
          <h3 style="margin:14px 0 10px;font-size:21px">{{ card.title }}</h3>
          <p style="margin:0;color:var(--elf-text-secondary);line-height:1.7">{{ card.text }}</p>
        </article>
      </elf-masonry>
    </elf-playground>
    <h2>API</h2>
    <elf-props-table title="Masonry Props" :rows=${[
      { name: "columns", type: "number", default: "3", desc: "最大列数" },
      { name: "min-column-width", type: "string | number", default: "240", desc: "自动减少列数时的最小列宽" },
      { name: "gap", type: "token | CSS length", default: "md", desc: "列与卡片间距" }
    ]}></elf-props-table>
  </elf-container>
`);

export { PageMasonry };
