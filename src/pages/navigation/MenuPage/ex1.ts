import { defineHtml, html, useRef } from "elfui";


const active = useRef("/workspace/projects");

const openeds = ["/workspace"];

const items = [
  { index: "/dashboard", label: "Dashboard", icon: "D" },
  {
    index: "/workspace",
    label: "Workspace",
    icon: "W",
    children: [
      { index: "/workspace/projects", label: "Projects" },
      { index: "/workspace/tasks", label: "Tasks" },
      { index: "/workspace/disabled", label: "Disabled item", disabled: true }
    ]
  },
  {
    index: "/settings",
    label: "Settings",
    icon: "S",
    children: [
      { index: "/settings/profile", label: "Profile" },
      { index: "/settings/security", label: "Security" }
    ]
  }
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const code = `<elf-menu
  :items="items"
  :modelValue="active"
  :defaultOpeneds="['/workspace']"
  unique-opened
  @update:modelValue="onChange"
/>`;

const PageMenuEx1 = defineHtml(html`
  <h2>基础用法</h2>
  <elf-playground title="垂直菜单 / 多级展开 / 禁用项" :code="code">
    <div
      style="display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:20px;align-items:start;width:100%;max-width:820px"
    >
      <elf-menu
        bordered
        :items="items"
        :modelValue="active"
        :defaultOpeneds="openeds"
        unique-opened
        @update:modelValue="onChange"
      ></elf-menu>
      <div
        style="padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
      >
        <div style="font-weight:600;color:var(--elf-text-primary)">当前选中</div>
        <div style="margin-top:8px;color:var(--elf-color-primary)">{{ active }}</div>
      </div>
    </div>
  </elf-playground>
`);

export { PageMenuEx1 };
