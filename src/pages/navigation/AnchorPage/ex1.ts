import { defineHtml, html, useRef } from "elfui";

const active = useRef("#anchor-basic-intro");

const lastClick = useRef("-");

const items = [
  { title: "Intro", href: "#anchor-basic-intro" },
  { title: "Usage", href: "#anchor-basic-usage" },
  { title: "API", href: "#anchor-basic-api" }
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail.href);
};

const onClick = (event: CustomEvent): void => {
  lastClick.set(event.detail.href);
};

const code = `<elf-anchor
  :items=\${items}
  container="#anchor-basic-scroll"
  :offset=\${8}
  @change=\${onChange}
  @click=\${onClick}
/>`;

const PageAnchorEx1 = defineHtml(html`
  <h2>Basic</h2>
  <elf-playground title="Scroll spy and click navigation" :code=${code}>
    <div
      style="display:grid;grid-template-columns:minmax(160px,220px) 1fr;gap:20px;width:100%;max-width:860px"
    >
      <elf-anchor
        :items=${items}
        container="#anchor-basic-scroll"
        :offset=${8}
        :modelValue=${active}
        @change=${onChange}
        @click=${onClick}
      ></elf-anchor>
      <div style="display:grid;gap:12px">
        <div style="display:flex;gap:12px;flex-wrap:wrap;color:var(--elf-text-secondary)">
          <span>Active: <strong style="color:var(--elf-primary)">{{ active }}</strong></span>
          <span>Clicked: <strong>{{ lastClick }}</strong></span>
        </div>
        <div
          id="anchor-basic-scroll"
          style="height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);scroll-behavior:smooth"
        >
          <section id="anchor-basic-intro" style="min-height:220px;padding:20px">
            <h3>Intro</h3>
            <p>Anchor listens to the scroll container and keeps the current section highlighted.</p>
          </section>
          <section
            id="anchor-basic-usage"
            style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)"
          >
            <h3>Usage</h3>
            <p>Clicking an item scrolls to the matching target and emits click/change events.</p>
          </section>
          <section
            id="anchor-basic-api"
            style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)"
          >
            <h3>API</h3>
            <p>Use offset and bounds to tune activation when sticky headers cover content.</p>
          </section>
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageAnchorEx1 };
