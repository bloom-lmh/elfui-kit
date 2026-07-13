import { defineHtml, html, useRef } from "elfui";

const active = useRef("reports");
const items = [
  { label: "收件箱", value: "inbox", icon: "收", content: "集中查看通知和待办消息。" },
  { label: "报表", value: "reports", icon: "报", content: "查看业务报表和趋势数据。" },
  { label: "设置", value: "settings", icon: "设", content: "管理系统和成员配置。" }
];

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
};

const onRemove = (event: CustomEvent): void => {
  const removed = String(event.detail?.name ?? event.detail ?? "");
  if (removed === active.value) active.set("reports");
};

const onAdd = (): void => {
  active.set("settings");
};

const code = `<elf-tabs
  type="border-card"
  tab-position="right"
  stretch
  editable
  show-panels
  :items.prop=\${items}
  :modelValue=\${active}
  @update:modelValue=\${onChange}
  @tab-remove=\${onRemove}
  @tab-add=\${onAdd}
/>`;

const PageTabsEx6 = defineHtml(html`
  <h2>卡片与可编辑标签</h2>
  <elf-playground title="右侧卡片与增删操作" :code=${code}>
    <div style="width:100%;max-width:860px">
      <elf-tabs
        type="border-card"
        tab-position="right"
        stretch
        editable
        show-panels
        :items.prop=${items}
        :modelValue=${active}
        @update:modelValue=${onChange}
        @tab-remove=${onRemove}
        @tab-add=${onAdd}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx6 };
