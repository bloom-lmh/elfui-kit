import { defineHtml, html, useRef } from "elfui";

const active = useRef("security");

const items = [
  { label: "资料", value: "profile", icon: "资", content: "账号资料和基础信息。" },
  { label: "安全", value: "security", icon: "安", content: "密码、双因素认证和访问密钥。" },
  { label: "账单", value: "billing", icon: "账", content: "账单周期、发票和套餐。" }
];

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
};

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  direction="vertical"
  density="comfortable"
  show-panels
  color="#006a6a"
  @update:modelValue=\${onChange}
/>`;

const PageTabsEx5 = defineHtml(html`
  <h2>布局变体：侧边导航</h2>
  <elf-playground title="垂直布局、舒适密度与内容面板" :code=${code}>
    <div style="width:100%;max-width:860px">
      <elf-tabs
        :items.prop=${items}
        :modelValue=${active}
        direction="vertical"
        density="comfortable"
        show-panels
        color="#006a6a"
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx5 };
