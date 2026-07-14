import { defineHtml, html, useRef } from "elfui";

const times = useRef(0);

const onClick = (): void => {
  times.set(times.value + 1);
};

const code = `<elf-back-top
  target="#backtop-custom-scroll"
  shape="square"
  size="48px"
  icon="Top"
  bottom="136px"
  right="72px"
  @click=\${onClick}
/>`;

const script = `const times = useRef(0);
const onClick = () => times.set(times.value + 1);`;

const PageBacktopEx2 = defineHtml(html`
  <h2>Custom style</h2>
  <elf-playground title="Square shape / custom icon / exposed click state" :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:100%;max-width:760px">
      <div style="color:var(--elf-text-secondary)">
        Click count: <strong style="color:var(--elf-primary)">{{ times }}</strong>
      </div>
      <div
        id="backtop-custom-scroll"
        style="height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <section style="min-height:220px;padding:20px">
          <h3>Square BackTop</h3>
          <p>This example uses a square Material button and custom text icon.</p>
        </section>
        <section style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)">
          <h3>More content</h3>
          <p>Use right, bottom, size and zIndex to avoid colliding with floating panels.</p>
        </section>
        <section style="min-height:220px;padding:20px;border-top:1px solid var(--elf-border)">
          <h3>End</h3>
          <p>The same component can be driven by a scroll container or by the window.</p>
        </section>
      </div>
      <elf-back-top
        target="#backtop-custom-scroll"
        shape="square"
        size="48px"
        icon="Top"
        bottom="136px"
        right="72px"
        @click=${onClick}
      ></elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx2 };
