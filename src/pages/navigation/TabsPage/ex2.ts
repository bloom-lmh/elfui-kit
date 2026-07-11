import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active1 = useRef("inbox");

const active2 = useRef("security");

const items = [
  { label: "Inbox", value: "inbox", icon: "I", content: "消息中心" },
  { label: "Reports", value: "reports", icon: "R", content: "报表中心" },
  { label: "Settings", value: "settings", icon: "S", content: "系统设置" }
];

const verticalItems = [
  { label: "Profile", value: "profile", icon: "U", content: "账号资料和基础信息。" },
  { label: "Security", value: "security", icon: "L", content: "密码、双因素认证和访问密钥。" },
  { label: "Billing", value: "billing", icon: "B", content: "账单周期、发票和套餐。" }
];

const setActive1 = (event: CustomEvent): void => {
  active1.set(String(event.detail));
};

const setActive2 = (event: CustomEvent): void => {
  active2.set(String(event.detail));
};

const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} grow stacked show-panels color="#6750a4" />
<elf-tabs :items.prop=\${items} direction="vertical" density="comfortable" show-panels />`;

const elementPlusCode = `<elf-tabs
  type="border-card"
  tab-position="right"
  stretch
  editable
  :items.prop=\${items}
  :modelValue=\${active}
  @tab-remove=\${onRemove}
  @tab-add=\${onAdd}
/>`;

const onRemove = (): void => {
  active1.set("reports");
};

const onAdd = (): void => {
  active1.set("settings");
};

const PageTabsEx2 = defineHtml(html`
  <h2>Vuetify 风格变体</h2>
  <elf-playground title="grow / stacked / color / vertical / density" :code=${code}>
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
      <elf-tabs
        :items.prop=${verticalItems}
        :modelValue=${active2}
        direction="vertical"
        density="comfortable"
        show-panels
        color="#006a6a"
        @update:modelValue=${setActive2}
      ></elf-tabs>
    </div>
  </elf-playground>

  <elf-playground title="card / tab-position / editable" :code=${elementPlusCode}>
    <div style="width:100%;max-width:860px">
      <elf-tabs
        type="border-card"
        tab-position="right"
        stretch
        editable
        show-panels
        :items.prop=${items}
        :modelValue=${active1}
        @update:modelValue=${setActive1}
        @tab-remove=${onRemove}
        @tab-add=${onAdd}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx2 };
