import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active = useRef("draft");

const items = [
  { label: "Draft", value: "draft", content: "自定义过渡通过 CSS 变量控制初始透明度和位移。" },
  {
    label: "Review",
    value: "review",
    content: "用户可以在宿主元素上覆盖 --tabs-custom-from-transform。"
  },
  { label: "Publish", value: "publish", content: "这适合产品里统一 tab panel 的动效语言。" }
];

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
};

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  transition="custom"
  style="--tabs-custom-from-transform: translateY(18px) scale(.96)"
  show-panels
  @update:modelValue=\${onChange}
/>`;

const PageTabsEx4 = defineHtml(html`
  <h2>自定义过渡</h2>
  <elf-playground title="transition='custom' + CSS variables" :code=${code}>
    <div style="width:100%;max-width:760px">
      <elf-tabs
        :items.prop=${items}
        :modelValue=${active}
        show-panels
        transition="custom"
        :transitionDuration=${320}
        style="--tabs-custom-from-transform: translateY(18px) scale(.96)"
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx4 };
