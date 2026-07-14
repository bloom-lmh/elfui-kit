import { defineHtml, html, useRef } from "elfui";


const active = useRef("inbox");

const active2 = useRef("home");

const items = [
  { index: "inbox", label: "收件箱", icon: "✉", badge: 12 },
  { index: "drafts", label: "草稿", icon: "📝", badge: 3 },
  { divider: true },
  { index: "starred", label: "星标", icon: "★" },
  { index: "archive", label: "归档", icon: "📦" },
  { divider: true },
  {
    group: "标签",
    children: [
      { index: "personal", label: "个人" },
      { index: "work", label: "工作", badge: 5 },
      { index: "travel", label: "旅行" }
    ]
  }
];

const items2 = [
  { index: "home", label: "首页", icon: "🏠" },
  { index: "explore", label: "探索", icon: "🔍" },
  { divider: true },
  { index: "favorites", label: "收藏", icon: "❤", badge: 8 },
  {
    group: "资料库",
    children: [
      { index: "recent", label: "最近" },
      { index: "liked", label: "喜欢" },
      { index: "saved", label: "已保存", badge: 42 }
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
  bordered
  rounded
  elevation
  show-toggle
  toggle-placement="header"
>
  <template #header>...</template>
</elf-menu>`;

const PageMenuEx4 = defineHtml(html`
  <h2>分隔线、徽章、分组与头尾区域</h2>
  <elf-playground title="完整菜单：分隔线、徽章、分组、头像、底栏" :code=${code}>
    <elf-menu :items=${items} :modelValue=${active} bordered rounded elevation style="height:540px">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div>
            <strong>管理员</strong><br /><span style="font-size:12px;color:var(--elf-text-secondary)"
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

  <h2>搜索、分组、徽章与折叠按钮</h2>
  <elf-playground title="搜索过滤 + 分组标题 + 折叠切换" :code=${code2}>
    <elf-menu
      :items=${items2}
      :modelValue=${active2}
      searchable
      bordered
      rounded
      elevation
      show-toggle
      toggle-placement="header"
      style="height:480px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div><strong>当前用户</strong></div>
        </div>
      </template>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx4 };
