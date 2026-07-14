import { defineHtml, html, useRef } from "elfui";


const active = useRef("analytics/realtime");

const openedText = useRef("默认展开：Analytics");

const items = [
    {
        index: "analytics",
        label: "Analytics",
        icon: "A",
        children: [
            { index: "analytics/realtime", label: "Realtime" },
            { index: "analytics/cohort", label: "Cohort" },
        ],
    },
    {
        index: "workspace",
        label: "Workspace",
        icon: "W",
        children: [
            { index: "workspace/projects", label: "Projects" },
            { index: "workspace/tasks", label: "Tasks" },
        ],
    },
    {
        index: "settings",
        label: "Settings",
        icon: "S",
        children: [
            { index: "settings/profile", label: "Profile" },
            { index: "settings/security", label: "Security" },
        ],
    },
];

const onOpen = (event: CustomEvent): void => {
    openedText.set(`当前展开：${String(event.detail[0])}`);
};

const onSelect = (event: CustomEvent): void => {
    active.set(String(event.detail));
};

const code = `<elf-menu
  :items.prop="items"
  :modelValue="active"
  :defaultOpeneds.prop="['analytics']"
  unique-opened
  @open="onOpen"
/>`;

const PageMenuEx7 = defineHtml(html`
    <h2>唯一展开</h2>
    <elf-playground title="unique-opened 展开当前分组时关闭其它分组" :code="code">
        <div
            style="display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:20px;align-items:start;width:100%;max-width:820px"
        >
            <elf-menu
                bordered
                :items.prop="items"
                :modelValue="active"
                :defaultOpeneds.prop="['analytics']"
                unique-opened
                @open="onOpen"
                @update:modelValue="onSelect"
            ></elf-menu>
            <div
                style="padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
            >
                <strong>交互状态</strong>
                <p style="margin:8px 0 0;color:var(--elf-text-secondary)">{{ openedText }}</p>
                <p style="margin:4px 0 0;color:var(--elf-primary)">当前选中：{{ active }}</p>
            </div>
        </div>
    </elf-playground>
`);

export { PageMenuEx7 };
