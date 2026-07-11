import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active = useRef("overview");

const items = [
  { label: "Overview", value: "overview", content: "概览面板使用 slide 过渡进入。" },
  { label: "Metrics", value: "metrics", content: "指标面板会在切换时轻微滑入。" },
  { label: "Logs", value: "logs", content: "日志面板保持同样的过渡节奏。" }
];

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
};

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  show-panels
  transition="slide"
  :transitionDuration=\${260}
/>`;

const PageTabsEx3 = defineHtml(html`
  <h2>面板过渡</h2>
  <elf-playground title="transition='slide' / transition-duration" :code=${code}>
    <div style="width:100%;max-width:760px">
      <elf-tabs
        :items.prop=${items}
        :modelValue=${active}
        show-panels
        transition="slide"
        :transitionDuration=${260}
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx3 };
