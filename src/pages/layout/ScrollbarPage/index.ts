import { defineHtml, html, useRef } from "elfui";

const scrollTop = useRef(0);

const longList = Array.from({ length: 16 }, (_, index) => `内容行 ${index + 1}`);

const code1 = `<elf-scrollbar
  :height=\${240}
  always
  @scroll=\${onScroll}
>
  <div v-for="row in longList" :key="row" class="demo-row">{{ row }}</div>
</elf-scrollbar>
<span class="demo-state">scrollTop: \${scrollTop}</span>`;

const script1 = `const scrollTop = useRef(0);

const longList = Array.from({ length: 16 }, (_, index) => \`内容行 \${index + 1}\`);

const onScroll = (event) => {
  scrollTop.set(event.detail.scrollTop);
};`;

const code2 = `<elf-scrollbar max-height="180px">
  <div v-for="row in longList" :key="row" class="demo-row">{{ row }}</div>
</elf-scrollbar>`;

const onScroll = (event: CustomEvent): void => {
  const detail = (event.detail || {}) as { scrollTop?: number };
  scrollTop.set(Number(detail.scrollTop) || 0);
};

const PageScrollbar = defineHtml(html`
  <elf-container>
    <h1>Scrollbar 滚动条</h1>
    <p>包裹滚动内容并抛出 scroll 事件，支持固定高度、最大高度和 always 显示。</p>

    <elf-playground title="height / always / scroll" :code=${code1} :script=${script1}>
      <elf-scrollbar :height=${240} always @scroll=${onScroll}>
        <div v-for="row in longList" :key="row" class="demo-row">{{ row }}</div>
      </elf-scrollbar>
      <span class="demo-state">scrollTop: ${Math.round(scrollTop.value)}</span>
    </elf-playground>

    <elf-playground title="max-height" :code=${code2}>
      <elf-scrollbar max-height="180px">
        <div v-for="row in longList" :key="row" class="demo-row">{{ row }}</div>
      </elf-scrollbar>
    </elf-playground>
  </elf-container>
`);

export { PageScrollbar };
