import { defineHtml, defineStyle, html, onMount, onUnmount, useRef } from "elfui";

import utilityStyles from "../../../styles/utilities.scss?inline";
import pageStyles from "./style.scss?inline";
import { BREAKPOINTS, CATALOG, type UtilityCategory, type UtilityKey } from "./catalog";

const ELEVATIONS = [0, 1, 2, 3, 4, 5];
const OPACITIES = [0, 20, 40, 60, 80, 100];
const RADII = ["0", "sm", "md", "lg", "xl", "pill", "circle", "shaped"];
const SIZES = [25, 33, 50, 66, 75, 100];

const readCategory = (): UtilityKey => {
  if (typeof window === "undefined") return "borders";
  const key = window.location.hash.split("/").filter(Boolean).at(-1) as UtilityKey;
  return key in CATALOG ? key : "borders";
};

// State
const category = useRef<UtilityKey>(readCategory());
const viewportWidth = useRef(typeof window === "undefined" ? 1280 : window.innerWidth);
let removeListeners = (): void => {};

// Derived state
const current = (): UtilityCategory => CATALOG[category.value];
const isCategory = (key: UtilityKey): boolean => category.value === key;
const hasResponsiveGroups = (): boolean => current().groups.some((group) => group.responsive);
const activeBreakpoint = (): string => {
  const width = viewportWidth.value;
  if (width >= 2138) return "xxl";
  if (width >= 1545) return "xl";
  if (width >= 1145) return "lg";
  if (width >= 840) return "md";
  if (width >= 600) return "sm";
  return "xs";
};

// Lifecycle
onMount(() => {
  const syncCategory = () => category.set(readCategory());
  const syncViewport = () => viewportWidth.set(window.innerWidth);
  syncCategory();
  syncViewport();
  window.addEventListener("hashchange", syncCategory);
  window.addEventListener("resize", syncViewport, { passive: true });
  removeListeners = () => {
    window.removeEventListener("hashchange", syncCategory);
    window.removeEventListener("resize", syncViewport);
  };
});

onUnmount(() => removeListeners());

defineStyle(`${utilityStyles}\n${pageStyles}`);

const PageUtilities = defineHtml(html`
  <elf-container>
    <header class="utility-hero">
      <div>
        <span class="eyebrow">${current().eyebrow}</span>
        <h1>${current().title}</h1>
        <p>${current().description}</p>
      </div>
      <a
        class="source-link"
        href="https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_utilities.scss"
        target="_blank"
        rel="noreferrer"
      >
        Vuetify 4 source ↗
      </a>
    </header>

    <section v-if=${hasResponsiveGroups()} class="breakpoint-panel" aria-label="Vuetify breakpoints">
      <div class="breakpoint-heading">
        <strong>响应式断点</strong>
        <span>当前：<b>${activeBreakpoint()}</b> · ${viewportWidth.value}px</span>
      </div>
      <div class="breakpoint-grid">
        <div
          v-for="point in BREAKPOINTS"
          :key="point.name"
          :class="['breakpoint-item', { 'is-active': point.name === activeBreakpoint() }]"
        >
          <strong>{{ point.name }}</strong>
          <span>{{ point.range }}</span>
          <small>min {{ point.min }}</small>
        </div>
      </div>
    </section>

    <elf-playground :title=${`${current().title} · Live preview`} :code=${current().code}>
      <span slot="status" class="demo-state">Vuetify 4 compatible</span>
      <div class="utility-stage">
        <div v-if=${isCategory("borders")} class="preview-grid preview-grid--3">
          <div class="preview-card border">border</div>
          <div class="preview-card border-md border-primary">border-md</div>
          <div class="preview-card border-lg border-dashed border-success">dashed</div>
          <div class="preview-card border-t-xl border-warning">top</div>
          <div class="preview-card border-e-lg border-danger">end</div>
          <div class="preview-card border border-opacity-25">opacity</div>
        </div>

        <div v-if=${isCategory("border-radius")} class="shape-grid">
          <div v-for="radius in RADII" :key="radius" :class="['shape', 'rounded-' + radius]">
            {{ radius }}
          </div>
        </div>

        <div v-if=${isCategory("content")} class="content-preview">
          <div class="media-card">
            <div class="media-art object-cover">ELF</div>
            <div><strong>Accessible content</strong><p>Screen-reader and pointer-event helpers are included.</p></div>
          </div>
          <a class="focus-link d-sr-only-focusable" href="#utility-reference">Skip to class reference</a>
          <div class="pointer-demo pointer-pass-through"><button class="pointer-events-auto">Interactive child</button></div>
        </div>

        <div v-if=${isCategory("cursor")} class="cursor-grid">
          <button v-for="cursor in ['pointer','grab','grabbing','progress','help','not-allowed']" :key="cursor" :class="'cursor-' + cursor">
            {{ cursor }}
          </button>
        </div>

        <div v-if=${isCategory("display")} class="display-preview">
          <div class="responsive-orbit"><span class="d-block d-sm-none">xs</span><span class="d-none d-sm-block d-md-none">sm</span><span class="d-none d-md-block d-lg-none">md</span><span class="d-none d-lg-block d-xl-none">lg</span><span class="d-none d-xl-block d-xxl-none">xl</span><span class="d-none d-xxl-block">xxl</span></div>
          <div class="display-stack"><span class="d-inline">inline</span><span class="d-inline-block">inline-block</span><span class="d-flex">flex</span><span class="d-grid">grid extension</span></div>
        </div>

        <div v-if=${isCategory("elevation")} class="elevation-grid">
          <div v-for="level in ELEVATIONS" :key="level" :class="['elevation-tile', 'elevation-' + level, 'hover-elevation-5']">
            <span>{{ level }}</span><small>hover → 5</small>
          </div>
        </div>

        <div v-if=${isCategory("flex")} class="flex-preview">
          <div class="d-flex flex-column flex-md-row ga-4 align-stretch">
            <article class="flex-md-1-1-0 order-2 order-md-1"><small>PROJECT</small><strong>Design system</strong><span>Responsive main panel</span></article>
            <aside class="d-flex flex-row flex-md-column ga-2 justify-center order-1 order-md-2"><b>12</b><span>Tasks</span><b>94%</b><span>Ready</span></aside>
          </div>
        </div>

        <div v-if=${isCategory("float")} class="float-preview clearfix">
          <div class="float-start me-4 mb-2 editorial-art">A</div>
          <h3>Editorial flow</h3>
          <p>Logical float helpers let this copy wrap around the visual while preserving the correct start edge in both LTR and RTL layouts. The clearfix keeps the following content outside the float context.</p>
        </div>

        <div v-if=${isCategory("opacity")} class="opacity-grid">
          <div v-for="value in OPACITIES" :key="value" :class="['opacity-swatch', 'opacity-' + value]"><span>{{ value }}</span></div>
        </div>

        <div v-if=${isCategory("overflow")} class="overflow-grid">
          <div class="overflow-box overflow-auto"><div class="overflow-content">auto · content can scroll in both directions</div></div>
          <div class="overflow-box overflow-x-scroll"><div class="overflow-content">x-scroll · horizontal viewport</div></div>
          <div class="overflow-box overflow-hidden"><div class="overflow-content">hidden · clipped boundary</div></div>
        </div>

        <div v-if=${isCategory("position")} class="position-preview position-relative">
          <span class="anchor anchor--tl position-absolute top-0 left-0">top left</span>
          <span class="anchor anchor--tr position-absolute top-0 right-0">top right</span>
          <div class="position-center">relative parent</div>
          <span class="anchor anchor--bl position-absolute bottom-0 left-0">bottom left</span>
          <span class="anchor anchor--br position-absolute bottom-0 right-0">bottom right</span>
        </div>

        <div v-if=${isCategory("sizing")} class="sizing-preview">
          <div v-for="size in SIZES" :key="size" :class="['size-bar', 'w-' + size]"><span>{{ size }}%</span></div>
        </div>

        <div v-if=${isCategory("spacing")} class="spacing-preview pa-6 ga-4 d-grid">
          <div class="spacing-row d-flex ga-1"><span class="pa-1">1</span><span class="pa-2">2</span><span class="pa-3">3</span><span class="pa-4">4</span></div>
          <div class="spacing-row d-flex ga-4"><span class="pa-4">ga-4</span><span class="pa-4">16px</span><span class="pa-4">rhythm</span></div>
          <div class="negative-demo ma-4 mt-n2">mt-n2 pulls this surface upward by 8px</div>
        </div>

        <div v-if=${isCategory("typography")} class="type-preview">
          <span class="text-label-small text-uppercase text-medium-emphasis">Material 3 type scale</span>
          <h2 class="text-display-small text-md-display-medium">Clarity at every scale.</h2>
          <p class="text-body-large text-medium-emphasis">Responsive typography preserves hierarchy from compact screens to wide workspaces.</p>
          <div class="type-samples"><span class="text-title-large">Title large</span><span class="text-body-medium">Body medium</span><span class="text-label-small">LABEL SMALL</span></div>
        </div>
      </div>
    </elf-playground>

    <elf-alert class="utility-note" type="info" :title=${current().note}></elf-alert>

    <section id="utility-reference" class="reference-section">
      <div class="section-heading"><span class="eyebrow">CLASS REFERENCE</span><h2>类名规则</h2></div>
      <div class="reference-grid">
        <article v-for="group in current().groups" :key="group.pattern" class="reference-card">
          <div class="reference-title"><h3>{{ group.title }}</h3><elf-tag v-if="group.responsive" size="sm" variant="outlined">responsive</elf-tag></div>
          <code class="pattern">{{ group.pattern }}</code>
          <p>{{ group.values }}</p>
          <div class="class-list"><code v-for="name in group.examples" :key="name">.{{ name }}</code></div>
        </article>
      </div>
    </section>

    <section class="usage-section">
      <div><span class="eyebrow">USAGE</span><h2>发布与作用域</h2></div>
      <p>工具类随 ElfUI 全局样式发布，作用于应用 Light DOM；Shadow DOM 内部仍通过 Provider token、组件属性和公开 CSS variables 定制。</p>
    </section>
  </elf-container>
`);

export { PageUtilities };
