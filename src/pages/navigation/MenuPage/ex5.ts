import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const active = useRef("platform-web");

const items = [
  {
    index: "platform",
    label: "Platform",
    icon: "⚙",
    children: [
      {
        index: "platform-web",
        label: "Web",
        icon: "🌐",
        children: [
          { index: "platform-web-react", label: "React", icon: "⚛" },
          { index: "platform-web-vue", label: "Vue", icon: "💚" },
          { index: "platform-web-svelte", label: "Svelte", icon: "🔥" }
        ]
      },
      {
        index: "platform-mobile",
        label: "Mobile",
        icon: "📱",
        children: [
          { index: "platform-mobile-ios", label: "iOS", icon: "🍎" },
          { index: "platform-mobile-android", label: "Android", icon: "🤖" }
        ]
      }
    ]
  },
  { divider: true },
  {
    index: "develop",
    label: "Develop",
    icon: "⌨",
    children: [
      { index: "develop-api", label: "API Keys", icon: "🔑", badge: 3 },
      { index: "develop-webhooks", label: "Webhooks", icon: "🪝" },
      { index: "develop-logs", label: "Logs", icon: "📋" }
    ]
  },
  { index: "docs", label: "Documentation", icon: "📖" }
];

const code = `<elf-menu :items="items" :modelValue="active" :defaultOpeneds="['platform','platform-web']" unique-opened rounded elevation show-toggle style="max-height:540px">
  <template #header>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar size="sm" alt="Dev"></elf-avatar>
      <div><strong>Developer</strong><br/><span style="font-size:12px;color:var(--elf-text-secondary)">dev@elfui.dev</span></div>
    </div>
  </template>
  <template #footer>
    <div style="display:flex;align-items:center;justify-content:flex-end">
      <elf-button variant="text" size="sm">退出</elf-button>
    </div>
  </template>
</elf-menu>`;

const PageMenuEx5 = defineHtml(html`
  <h2>多级菜单（3 层嵌套）</h2>
  <elf-playground title="Platform > Web > React/Vue/Svelte" :code="code">
    <elf-menu
      :items="items"
      :modelValue="active"
      :defaultOpeneds="['platform','platform-web']"
      unique-opened
      rounded
      elevation
      show-toggle
      style="max-height:540px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <elf-avatar size="sm" alt="Dev"></elf-avatar>
          <div>
            <strong>Developer</strong><br /><span
              style="font-size:12px;color:var(--elf-text-secondary)"
              >dev@elfui.dev</span
            >
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display:flex;align-items:center;justify-content:flex-end">
          <elf-button variant="text" size="sm">退出</elf-button>
        </div>
      </template>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx5 };
