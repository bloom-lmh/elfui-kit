import { defineHtml, html, useRef } from "elfui";


const active1 = useRef("inbox");

const items = [
  { label: "收件箱", value: "inbox", icon: "收", content: "消息中心" },
  { label: "报表", value: "reports", icon: "报", content: "报表中心" },
  { label: "设置", value: "settings", icon: "设", content: "系统设置" }
];

const setActive1 = (event: CustomEvent): void => {
  active1.set(String(event.detail));
};

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  grow
  stacked
  show-panels
  color="#6750a4"
/>`;

const PageTabsEx2 = defineHtml(html`
  <h2>外观变体：顶部导航</h2>
  <elf-playground title="等宽、堆叠与主题色" :code=${code}>
    <div style="display:grid;gap:20px;width:100%;max-width:860px">
      <elf-tabs
        :items.prop=${items}
        :modelValue=${active1}
        grow
        stacked
        show-panels
        color="#6750a4"
        @update:modelValue=${setActive1}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx2 };
