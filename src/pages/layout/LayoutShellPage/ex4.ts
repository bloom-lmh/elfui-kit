import { defineHtml, defineStyle, html } from "elfui";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "常见产品布局", en: "Common product layouts" },
  title: { zh: "九种响应式应用骨架", en: "Nine responsive application shells" },
  baseline: { zh: "基础双栏", en: "Baseline" },
  toolbar: { zh: "扩展工具栏", en: "Extended toolbar" },
  system: { zh: "系统栏", en: "System bar" },
  inbox: { zh: "收件箱", en: "Inbox" },
  constrained: { zh: "限宽内容", en: "Constrained" },
  side: { zh: "侧边导航", en: "Side navigation" },
  three: { zh: "三栏布局", en: "Three columns" },
  community: { zh: "社区工作区", en: "Community workspace" },
  store: { zh: "商店布局", en: "Store layout" },
  script: { zh: "九组结构均由 Layout、Header、Aside、Main 与 Footer 组合。", en: "All nine structures compose Layout, Header, Aside, Main, and Footer." }
});

const code = `<elf-layout>
  <elf-header>Header</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside>Aside</elf-aside>
    <elf-main>Main</elf-main>
  </elf-layout>
</elf-layout>`;

const script = (): string => `// ${t("script")}`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .layout-gallery { display:grid; width:100%; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }
  figure { min-width:0; margin:0; }
  figcaption { margin-top:8px; color:var(--elf-text-secondary); font-size:13px; font-weight:700; text-align:center; }
  .preview { height:210px; overflow:hidden; border:1px dashed var(--elf-border-strong); border-radius:4px; background:transparent; }
  .preview elf-layout { height:100%; min-width:0; }
  .preview elf-header, .preview elf-footer, .preview elf-aside, .preview elf-main { min-width:0; padding:8px; border-color:var(--elf-border-strong); background:transparent; color:var(--elf-text-secondary); font-size:11px; }
  .preview elf-header { border-bottom:1px dashed var(--elf-border-strong); }
  .preview elf-footer { border-top:1px dashed var(--elf-border-strong); }
  .preview elf-aside { border-right:1px dashed var(--elf-border-strong); }
  .preview .right-aside { border-right:0; border-left:1px dashed var(--elf-border-strong); }
  .preview .sub-header { border-top:1px dashed var(--elf-border-strong); }
  .content-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:100%; }
  .content-grid span { min-height:38px; border:1px dashed var(--elf-border); }
  .center-panel { width:min(76%,230px); min-height:120px; margin:auto; border:1px dashed var(--elf-border-strong); }
  @media (max-width:900px) { .layout-gallery { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media (max-width:560px) { .layout-gallery { grid-template-columns:1fr; } .preview { height:190px; } }
`);

const PageLayoutShellEx4 = defineHtml(html`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <div class="layout-gallery">
      <figure><div class="preview"><elf-layout direction="horizontal"><elf-aside width="72px">Nav</elf-aside><elf-main>Main</elf-main></elf-layout></div><figcaption>${t("baseline")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="54px">Toolbar</elf-header><elf-main><div class="content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div><figcaption>${t("toolbar")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="28px">System</elf-header><elf-header class="sub-header" height="48px">Toolbar</elf-header><elf-main><div class="content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div><figcaption>${t("system")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="42px">Inbox</elf-header><elf-layout direction="horizontal"><elf-aside width="92px">Folders</elf-aside><elf-main><div class="content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></elf-layout></div><figcaption>${t("inbox")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="44px">Toolbar</elf-header><elf-main><div class="center-panel"></div></elf-main></elf-layout></div><figcaption>${t("constrained")}</figcaption></figure>
      <figure><div class="preview"><elf-layout direction="horizontal"><elf-aside width="48px">Rail</elf-aside><elf-main>Main</elf-main></elf-layout></div><figcaption>${t("side")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="44px">Toolbar</elf-header><elf-layout direction="horizontal"><elf-aside width="72px">Left</elf-aside><elf-main>Main</elf-main><elf-aside class="right-aside" width="72px">Right</elf-aside></elf-layout></elf-layout></div><figcaption>${t("three")}</figcaption></figure>
      <figure><div class="preview"><elf-layout direction="horizontal"><elf-aside width="42px">Rail</elf-aside><elf-aside width="86px">Rooms</elf-aside><elf-main>Main</elf-main><elf-aside class="right-aside" width="70px">Info</elf-aside></elf-layout></div><figcaption>${t("community")}</figcaption></figure>
      <figure><div class="preview"><elf-layout><elf-header height="42px">Store</elf-header><elf-layout direction="horizontal"><elf-aside width="86px">Filters</elf-aside><elf-main><div class="content-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout><elf-footer height="20px"></elf-footer></elf-layout></div><figcaption>${t("store")}</figcaption></figure>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx4 };
