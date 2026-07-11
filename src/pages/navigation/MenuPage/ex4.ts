import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active = useRef("inbox");

const active2 = useRef("home");

const items = [
  { index: "inbox", label: "Inbox", icon: "✉", badge: 12 },
  { index: "drafts", label: "Drafts", icon: "📝", badge: 3 },
  { divider: true },
  { index: "starred", label: "Starred", icon: "★" },
  { index: "archive", label: "Archive", icon: "📦" },
  { divider: true },
  {
    group: "标签",
    children: [
      { index: "personal", label: "Personal" },
      { index: "work", label: "Work", badge: 5 },
      { index: "travel", label: "Travel" }
    ]
  }
];

const items2 = [
  { index: "home", label: "Home", icon: "🏠" },
  { index: "explore", label: "Explore", icon: "🔍" },
  { divider: true },
  { index: "favorites", label: "Favorites", icon: "❤", badge: 8 },
  {
    group: "Library",
    children: [
      { index: "recent", label: "Recent" },
      { index: "liked", label: "Liked" },
      { index: "saved", label: "Saved", badge: 42 }
    ]
  }
];

const code = `<elf-menu :items=\${items} :modelValue=\${active} rounded elevation>
  <template #header>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar size="sm" alt="User"></elf-avatar>
      <div><strong>Admin</strong><br/><span style="font-size:12px;color:var(--elf-text-secondary)">admin@elfui.dev</span></div>
    </div>
  </template>
  <template #footer>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:12px;color:var(--elf-text-disabled)">v1.0.0</span>
      <elf-button variant="text" size="sm">退出</elf-button>
    </div>
  </template>
</elf-menu>`;

const code2 = `<elf-menu
  :items=\${items}
  :modelValue=\${active}
  searchable
  rounded
  elevation
  show-toggle
  toggle-placement="header"
>
  <template #header>...</template>
  <template #search>
    <input class="my-search" placeholder="过滤菜单..." />
  </template>
</elf-menu>`;

const PageMenuEx4 = defineHtml(html`
  <h2>divider / badge / group / header+footer</h2>
  <elf-playground title="完整菜单：分隔线、徽章、分组、头像、底栏" :code=${code}>
    <elf-menu :items=${items} :modelValue=${active} rounded elevation style="height:540px">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div>
            <strong>Admin</strong><br /><span style="font-size:12px;color:var(--elf-text-secondary)"
              >admin@elfui.dev</span
            >
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;color:var(--elf-text-disabled)">v1.0.0</span>
          <elf-button variant="text" size="sm">退出</elf-button>
        </div>
      </template>
    </elf-menu>
  </elf-playground>

  <h2>searchable + group + badge + toggle</h2>
  <elf-playground title="搜索过滤 + 分组标题 + 折叠切换" :code=${code2}>
    <elf-menu
      :items=${items2}
      :modelValue=${active2}
      searchable
      rounded
      elevation
      show-toggle
      toggle-placement="header"
      style="height:480px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div><strong>User</strong></div>
        </div>
      </template>
      <template #search>
        <input
          style="width:100%;box-sizing:border-box;border:1px solid var(--elf-border);border-radius:999px;padding:8px 12px;background:var(--elf-bg-paper);font:inherit;font-size:13px;outline:none"
          placeholder="过滤菜单..."
        />
      </template>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx4 };
