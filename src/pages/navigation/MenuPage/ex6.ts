import { defineHtml, html, useRef } from "elfui";

const active = useRef("analytics");
const activeDark = useRef("home");
const activeCustom = useRef("profile");

const items = [
  {
    index: "analytics",
    label: "Analytics",
    icon: "A",
    children: [
      { index: "analytics-overview", label: "Overview" },
      { index: "analytics-realtime", label: "Realtime" },
      { index: "analytics-retention", label: "Retention" }
    ]
  },
  {
    index: "workspace",
    label: "Workspace",
    icon: "W",
    children: [
      { index: "workspace-projects", label: "Projects" },
      { index: "workspace-tasks", label: "Tasks" }
    ]
  },
  { index: "settings", label: "Settings", icon: "S" }
];

const themeItems = [
  { index: "home", label: "Home", icon: "H" },
  { index: "profile", label: "Profile", icon: "P", badge: "new" },
  { index: "messages", label: "Messages", icon: "M", badge: 5 },
  { divider: true },
  {
    index: "settings",
    label: "Settings",
    icon: "S",
    children: [
      { index: "general", label: "General" },
      { index: "security", label: "Security" },
      { index: "notifications", label: "Notifications", badge: 3 }
    ]
  }
];

const code1 = `<elf-menu
  :items=\${items}
  :modelValue=\${active}
  menu-trigger="hover"
  :showTimeout=\${120}
  :hideTimeout=\${260}
  rounded
>
  <template #header>
    <strong>Hover Menu</strong>
  </template>
</elf-menu>`;

const code2 = `<elf-menu :items=\${items} :modelValue=\${activeDark} theme="dark" rounded show-toggle />

<elf-menu
  :items=\${items}
  :modelValue=\${activeCustom}
  backgroundColor="#f5f0ff"
  activeTextColor="#7c3aed"
  activeBackground="rgba(124,58,237,0.12)"
  rounded
/>`;

const PageMenuEx6 = defineHtml(html`
  <h2>hover 展开</h2>
  <elf-playground title="menu-trigger hover" :code=${code1}>
    <elf-menu
      :items=${items}
      :modelValue=${active}
      menu-trigger="hover"
      :showTimeout=${120}
      :hideTimeout=${260}
      rounded
      style="height:360px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:8px">
          <elf-avatar size="sm" alt="Hover"></elf-avatar>
          <strong>Hover Menu</strong>
        </div>
      </template>
    </elf-menu>
  </elf-playground>

  <h2>theme + custom colors</h2>
  <elf-playground title="dark theme + custom colors" :code=${code2}>
    <div style="display:flex;gap:16px">
      <elf-menu
        :items=${themeItems}
        :modelValue=${activeDark}
        theme="dark"
        rounded
        show-toggle
        style="height:400px"
      ></elf-menu>
      <elf-menu
        :items=${themeItems}
        :modelValue=${activeCustom}
        backgroundColor="#f5f0ff"
        activeTextColor="#7c3aed"
        activeBackground="rgba(124,58,237,0.12)"
        rounded
        style="height:400px"
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx6 };
