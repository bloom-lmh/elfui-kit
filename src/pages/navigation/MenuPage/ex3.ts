import { defineHtml, html, useRef } from "elfui";


const active = useRef("overview");

const collapsedActive = useRef("overview");

const openeds = ["team"];

const customProps = {
  index: "id",
  label: "title",
  icon: "mark",
  disabled: "locked",
  children: "nodes"
};

const customItems = [
  { id: "overview", title: "Overview", mark: "O" },
  {
    id: "team",
    title: "Team",
    mark: "T",
    nodes: [
      { id: "team-members", title: "Members" },
      { id: "team-roles", title: "Roles", locked: true }
    ]
  },
  { id: "billing", title: "Billing", mark: "B" }
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const onCollapsedChange = (event: CustomEvent): void => {
  collapsedActive.set(event.detail);
};

const code1 = `<elf-menu
  :items="customItems"
  :props="customProps"
  :modelValue="active"
  :defaultOpeneds="openeds"
/>

<elf-menu
  collapse
  show-toggle
  :items="customItems"
  :props="customProps"
  :modelValue="collapsedActive"
/>`;

const PageMenuEx3 = defineHtml(html`
  <h2>折叠与自定义字段</h2>
  <elf-playground title="collapse / props 字段映射" :code="code1">
    <div style="display:flex;gap:20px;align-items:flex-start;width:100%;max-width:780px">
      <elf-menu
        bordered
        style="max-width:280px"
        :items="customItems"
        :props="customProps"
        :modelValue="active"
        :defaultOpeneds="openeds"
        @update:modelValue="onChange"
      ></elf-menu>
      <elf-menu
        bordered
        collapse
        show-toggle
        :items="customItems"
        :props="customProps"
        :modelValue="collapsedActive"
        @update:modelValue="onCollapsedChange"
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx3 };
