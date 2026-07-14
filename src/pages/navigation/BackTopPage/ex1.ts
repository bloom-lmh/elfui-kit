import { defineHtml, html, useRef } from "elfui";

const visible = useRef(false);

const clickState = useRef("not clicked");

const onVisible = (event: CustomEvent): void => {
  visible.set(Boolean(event.detail));
};

const onClick = (event: CustomEvent): void => {
  clickState.set(event.detail instanceof MouseEvent ? "MouseEvent received" : "clicked");
};

const code = `<elf-back-top
  target="#backtop-basic-scroll"
  :visibility-height=\${120}
  bottom="72px"
  right="72px"
  @visible-change=\${onVisible}
  @click=\${onClick}
/>`;

const script = `const visible = useRef(false);
const onVisible = (event) => visible.set(Boolean(event.detail));
const onClick = (event) => console.log(event.detail); // MouseEvent`;

const PageBacktopEx1 = defineHtml(html`
  <h2>Basic</h2>
  <elf-playground title="Scroll threshold / smooth back to top" :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:100%;max-width:760px">
      <div style="display:flex;gap:16px;color:var(--elf-text-secondary);flex-wrap:wrap">
        <span>Visible: <strong>{{ visible ? 'yes' : 'no' }}</strong></span>
        <span>Click event: <strong>{{ clickState }}</strong></span>
      </div>
      <div
        id="backtop-basic-scroll"
        style="height:280px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <section style="min-height:260px;padding:20px">
          <h3>Top</h3>
          <p>Scroll this panel down until the BackTop button appears.</p>
        </section>
        <section style="min-height:260px;padding:20px;border-top:1px solid var(--elf-border)">
          <h3>Content</h3>
          <p>The button listens to the target container instead of the whole page.</p>
        </section>
        <section style="min-height:260px;padding:20px;border-top:1px solid var(--elf-border)">
          <h3>Bottom</h3>
          <p>Clicking it emits the current scrollTop and scrolls back to zero.</p>
        </section>
      </div>
      <elf-back-top
        target="#backtop-basic-scroll"
        :visibility-height=${120}
        bottom="72px"
        right="72px"
        @visible-change=${onVisible}
        @click=${onClick}
      ></elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx1 };
