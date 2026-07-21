import { defineHtml, defineStyle, html } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "九种响应式应用骨架", en: "Nine responsive application shells" },
  baseline: { zh: "基础双栏", en: "Baseline" },
  toolbar: { zh: "扩展工具栏", en: "Extended toolbar" },
  system: { zh: "系统栏", en: "System bar" },
  inbox: { zh: "收件箱", en: "Inbox" },
  constrained: { zh: "限宽内容", en: "Constrained" },
  side: { zh: "侧边导航", en: "Side navigation" },
  three: { zh: "三栏布局", en: "Three columns" },
  community: { zh: "社区工作区", en: "Community workspace" },
  store: { zh: "商店布局", en: "Store layout" }
});

const baselineCode = `<elf-layout direction="horizontal">
  <elf-aside width="96px">Navigation</elf-aside>
  <elf-main>Workspace</elf-main>
</elf-layout>`;

const toolbarCode = `<elf-layout>
  <elf-header height="56px">Extended toolbar</elf-header>
  <elf-main>Workspace</elf-main>
</elf-layout>`;

const systemCode = `<elf-layout>
  <elf-header height="28px">System bar</elf-header>
  <elf-header height="52px">Toolbar</elf-header>
  <elf-main>Workspace</elf-main>
</elf-layout>`;

const inboxCode = `<elf-layout>
  <elf-header height="48px">Inbox toolbar</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="120px">Folders</elf-aside>
    <elf-main>Messages</elf-main>
  </elf-layout>
</elf-layout>`;

const constrainedCode = `<elf-layout>
  <elf-header height="52px">Toolbar</elf-header>
  <elf-main><section class="constrained-content">Content</section></elf-main>
</elf-layout>`;

const sideCode = `<elf-layout direction="horizontal">
  <elf-aside width="64px">Rail</elf-aside>
  <elf-main>Workspace</elf-main>
</elf-layout>`;

const threeCode = `<elf-layout>
  <elf-header height="48px">Toolbar</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="104px">Navigation</elf-aside>
    <elf-main>Workspace</elf-main>
    <elf-aside width="104px">Inspector</elf-aside>
  </elf-layout>
</elf-layout>`;

const communityCode = `<elf-layout direction="horizontal">
  <elf-aside width="56px">Rail</elf-aside>
  <elf-aside width="120px">Rooms</elf-aside>
  <elf-main>Conversation</elf-main>
  <elf-aside width="104px">Members</elf-aside>
</elf-layout>`;

const storeCode = `<elf-layout>
  <elf-header height="48px">Store toolbar</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="120px">Filters</elf-aside>
    <elf-main>Products</elf-main>
  </elf-layout>
  <elf-footer height="28px">Store status</elf-footer>
</elf-layout>`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .shell-preview { width:min(820px,100%); height:260px; overflow:hidden; border:1px solid var(--elf-border); border-radius:4px; background:var(--elf-bg-page); }
  .shell-preview elf-layout { min-width:0; height:100%; }
  .shell-preview elf-header, .shell-preview elf-footer, .shell-preview elf-aside, .shell-preview elf-main { min-width:0; padding:10px; color:var(--elf-text-primary); font-size:12px; font-weight:650; }
  .shell-preview elf-header { border-bottom:1px solid color-mix(in srgb,var(--elf-primary) 22%,var(--elf-divider)); background:color-mix(in srgb,var(--elf-primary) 14%,var(--elf-bg-paper)); }
  .shell-preview elf-header.system { background:color-mix(in srgb,var(--elf-info) 18%,var(--elf-bg-paper)); }
  .shell-preview elf-aside { border-right:1px solid color-mix(in srgb,var(--elf-secondary) 24%,var(--elf-divider)); background:color-mix(in srgb,var(--elf-secondary) 12%,var(--elf-bg-paper)); }
  .shell-preview elf-aside.secondary { background:color-mix(in srgb,var(--elf-info) 10%,var(--elf-bg-paper)); }
  .shell-preview elf-aside.inspector { border-right:0; border-left:1px solid color-mix(in srgb,var(--elf-warning) 24%,var(--elf-divider)); background:color-mix(in srgb,var(--elf-warning) 12%,var(--elf-bg-paper)); }
  .shell-preview elf-main { display:grid; align-content:start; gap:10px; background:color-mix(in srgb,var(--elf-success) 5%,var(--elf-bg-paper)); }
  .shell-preview elf-footer { border-top:1px solid color-mix(in srgb,var(--elf-success) 20%,var(--elf-divider)); background:color-mix(in srgb,var(--elf-success) 10%,var(--elf-bg-paper)); }
  .skeleton-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; width:100%; }
  .skeleton-grid span { min-height:46px; border:1px solid color-mix(in srgb,var(--elf-primary) 24%,var(--elf-border)); background:color-mix(in srgb,var(--elf-primary) 8%,transparent); }
  .skeleton-grid span:first-child { grid-column:span 2; }
  .constrained-content { width:min(72%,440px); min-height:150px; margin:auto; border:1px solid color-mix(in srgb,var(--elf-primary) 28%,var(--elf-border)); background:var(--elf-bg-paper); box-shadow:var(--elf-shadow-1); }
  @media (max-width:640px) {
    .shell-preview { height:220px; }
    .shell-preview elf-aside { width:64px !important; }
    .shell-preview elf-aside.secondary, .shell-preview elf-aside.inspector { display:none; }
    .skeleton-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  }
`);

const PageLayoutShellEx4 = defineHtml(html`
  <h2>${t("heading")}</h2>

  <elf-playground :title=${t("baseline")} :code=${baselineCode}>
    <div class="shell-preview"><elf-layout direction="horizontal"><elf-aside width="96px">Navigation</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("toolbar")} :code=${toolbarCode}>
    <div class="shell-preview"><elf-layout><elf-header height="56px">Extended toolbar</elf-header><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("system")} :code=${systemCode}>
    <div class="shell-preview"><elf-layout><elf-header class="system" height="28px">System bar</elf-header><elf-header height="52px">Toolbar</elf-header><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("inbox")} :code=${inboxCode}>
    <div class="shell-preview"><elf-layout><elf-header height="48px">Inbox toolbar</elf-header><elf-layout direction="horizontal"><elf-aside width="120px">Folders</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("constrained")} :code=${constrainedCode}>
    <div class="shell-preview"><elf-layout><elf-header height="52px">Toolbar</elf-header><elf-main><section class="constrained-content"></section></elf-main></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("side")} :code=${sideCode}>
    <div class="shell-preview"><elf-layout direction="horizontal"><elf-aside width="64px">Rail</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("three")} :code=${threeCode}>
    <div class="shell-preview"><elf-layout><elf-header height="48px">Toolbar</elf-header><elf-layout direction="horizontal"><elf-aside width="104px">Navigation</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main><elf-aside class="inspector" width="104px">Inspector</elf-aside></elf-layout></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("community")} :code=${communityCode}>
    <div class="shell-preview"><elf-layout direction="horizontal"><elf-aside width="56px">Rail</elf-aside><elf-aside class="secondary" width="120px">Rooms</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main><elf-aside class="inspector" width="104px">Members</elf-aside></elf-layout></div>
  </elf-playground>

  <elf-playground :title=${t("store")} :code=${storeCode}>
    <div class="shell-preview"><elf-layout><elf-header height="48px">Store toolbar</elf-header><elf-layout direction="horizontal"><elf-aside width="120px">Filters</elf-aside><elf-main><div class="skeleton-grid"><span></span><span></span><span></span><span></span><span></span></div></elf-main></elf-layout><elf-footer height="28px">Store status</elf-footer></elf-layout></div>
  </elf-playground>
`);

export { PageLayoutShellEx4 };
