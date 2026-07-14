import { defineHtml, html, useRef } from "elfui";


const active = useRef("activity");

const message = useRef("当前：activity");

const items = [
  { label: "Activity", value: "activity", icon: "A", content: "最近动态、待办和系统提醒。" },
  {
    label: "Projects",
    value: "projects",
    icon: "P",
    badge: 6,
    content: "项目进度、成员分工和里程碑。"
  },
  { label: "Archive", value: "archive", icon: "R", disabled: true, content: "已归档内容。" }
];

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
  message.set(`当前：${event.detail}`);
};

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  show-panels
  @update:modelValue=\${onChange}
/>`;

const PageTabsEx1 = defineHtml(html`
  <h2>基础用法</h2>
  <elf-playground title="受控选中 / badge / disabled / panels" :code=${code}>
    <div style="display:grid;gap:12px;width:100%;max-width:760px">
      <elf-tabs
        :items.prop=${items}
        :modelValue=${active}
        show-panels
        @update:modelValue=${onChange}
      ></elf-tabs>
      <p slot="status" class="demo-state">{{ message }}</p>
    </div>
  </elf-playground>
`);

export { PageTabsEx1 };
