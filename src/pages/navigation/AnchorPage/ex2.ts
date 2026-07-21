import { defineHtml, html, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  nested: { zh: "嵌套与受控模式", en: "Nested and controlled" },
  nestedTitle: { zh: "嵌套项 / 受控激活 / 禁用链接", en: "Nested items / controlled active / disabled link" },
  horizontalTitle: { zh: "水平滚动 / 下划线 / 无侧边标记", en: "Horizontal scrolling / underline / no side marker" },
  current: { zh: "当前", en: "Active" },
  start: { zh: "开始使用", en: "Getting started" }, install: { zh: "安装", en: "Install" },
  register: { zh: "注册", en: "Register" }, advanced: { zh: "进阶", en: "Advanced" },
  disabled: { zh: "禁用目标", en: "Disabled target" }, events: { zh: "事件", en: "Events" },
  overview: { zh: "概览", en: "Overview" }, installation: { zh: "安装", en: "Installation" },
  registration: { zh: "注册", en: "Registration" }, tokens: { zh: "设计令牌", en: "Design tokens" },
  accessibility: { zh: "无障碍", en: "Accessibility" }, keyboard: { zh: "键盘导航", en: "Keyboard navigation" },
  release: { zh: "发布说明", en: "Release notes" },
  startBody: { zh: "组件接收树形数据，并将其展平为清晰的导航轨道。", en: "The component accepts tree data and flattens it into a clear navigation rail." },
  installBody: { zh: "此示例通过 modelValue 受控管理激活项。", en: "The active item is controlled by modelValue in this example." },
  registerBody: { zh: "父级需要管理当前链接时，请监听 update:modelValue。", en: "Listen for update:modelValue when the parent owns the active href." },
  advancedBody: { zh: "偏移量与边界参数便于适配吸顶布局。", en: "Offsets and bounds make sticky-header layouts easier to tune." },
  disabledBody: { zh: "此章节存在，但对应导航项不可点击。", en: "This section exists, but its navigation item is disabled." },
  eventsBody: { zh: "change 返回新旧链接，click 返回当前项与链接。", en: "change emits the new and old href; click emits the item and href." },
  sectionBody: { zh: "滚动内容区时，锚点会同步当前文档章节。", en: "The anchor follows the active document section while the content area scrolls." }
});

const active = useRef("#anchor-nested-install");
const horizontalActive = useRef("#anchor-horizontal-overview");
const items = () => [
  { title: t("start"), href: "#anchor-nested-start", children: [
    { title: t("install"), href: "#anchor-nested-install" },
    { title: t("register"), href: "#anchor-nested-register" }
  ] },
  { title: t("advanced"), href: "#anchor-nested-advanced", children: [
    { title: t("disabled"), href: "#anchor-nested-disabled", disabled: true },
    { title: t("events"), href: "#anchor-nested-events" }
  ] }
];
const horizontalItems = () => [
  { title: t("overview"), href: "#anchor-horizontal-overview" },
  { title: t("installation"), href: "#anchor-horizontal-installation" },
  { title: t("registration"), href: "#anchor-horizontal-registration" },
  { title: t("tokens"), href: "#anchor-horizontal-tokens" },
  { title: t("accessibility"), href: "#anchor-horizontal-accessibility" },
  { title: t("keyboard"), href: "#anchor-horizontal-keyboard" },
  { title: t("release"), href: "#anchor-horizontal-release" }
];
const horizontalSections = () => horizontalItems().map((item, index) => ({
  ...item, id: item.href.slice(1), body: `${index + 1}. ${t("sectionBody")}`
}));
const onUpdate = (event: CustomEvent<string>): void => active.set(event.detail);
const onHorizontalUpdate = (event: CustomEvent<string>): void => horizontalActive.set(event.detail);

const code = `<elf-anchor :items.prop="items" :modelValue.prop="active" container="#anchor-nested-scroll" :bound="24" @update:modelValue="onUpdate" />`;
const horizontalCode = `<elf-anchor :items.prop="horizontalItems" direction="horizontal" type="underline" :marker="false" container="#anchor-horizontal-scroll" :modelValue.prop="horizontalActive" />`;
const script = `const active = useRef("#anchor-nested-install");
const items = [
  { title: "Getting started", href: "#start", children: [
    { title: "Install", href: "#install" },
    { title: "Register", href: "#register" }
  ] }
];
const onUpdate = (event) => active.set(event.detail);`;

const PageAnchorEx2 = defineHtml(html`
  <h2>${t("nested")}</h2>
  <elf-playground :title=${t("nestedTitle")} :code=${code} :script=${script}>
    <div style="display:grid;grid-template-columns:minmax(180px,240px) minmax(0,1fr);gap:20px;width:100%;max-width:900px">
      <elf-anchor :key=${t("nestedTitle")} :items.prop=${items()} :modelValue.prop=${active.value} container="#anchor-nested-scroll" :bound=${24} @update:modelValue=${onUpdate}></elf-anchor>
      <div id="anchor-nested-scroll" style="height:300px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
        <section id="anchor-nested-start" style="min-height:180px;padding:20px"><h3>${t("start")}</h3><p>${t("startBody")}</p></section>
        <section id="anchor-nested-install" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("install")}</h3><p>${t("installBody")}</p></section>
        <section id="anchor-nested-register" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("register")}</h3><p>${t("registerBody")}</p></section>
        <section id="anchor-nested-advanced" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("advanced")}</h3><p>${t("advancedBody")}</p></section>
        <section id="anchor-nested-disabled" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("disabled")}</h3><p>${t("disabledBody")}</p></section>
        <section id="anchor-nested-events" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("events")}</h3><p>${t("eventsBody")}</p></section>
      </div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("horizontalTitle")} :code=${horizontalCode} :script=${script}>
    <div style="width:100%;max-width:960px;min-width:0">
      <elf-anchor :key=${t("horizontalTitle")} :items.prop=${horizontalItems()} direction="horizontal" type="underline" :marker=${false} container="#anchor-horizontal-scroll" :bound=${24} :modelValue.prop=${horizontalActive.value} @update:modelValue=${onHorizontalUpdate}></elf-anchor>
      <div id="anchor-horizontal-scroll" style="height:300px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--elf-divider);border-top:0;background:var(--elf-bg-paper)">
        <section v-for="section in horizontalSections()" :key="section.id" :id="section.id" style="min-height:220px;padding:28px;border-bottom:1px solid var(--elf-divider)">
          <h3 style="margin:0 0 10px">{{ section.title }}</h3>
          <p style="margin:0;color:var(--elf-text-secondary)">{{ section.body }}</p>
        </section>
      </div>
      <span slot="status" class="demo-state">${t("current")}: {{ horizontalActive }}</span>
    </div>
  </elf-playground>
`);

export { PageAnchorEx2 };
