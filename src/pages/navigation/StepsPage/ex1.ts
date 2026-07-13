import { defineHtml, html, useRef } from "elfui";

const code1 = `<elf-steps
  :active=\${basicActive}
  :items.prop=\${steps}
  @update:active=\${onBasicUpdate}
/>`;

const code2 = `<elf-steps
  :active=\${active}
  :items.prop=\${steps}
  @update:active=\${onUpdateActive}
  @change=\${onChange}
/>
<elf-button @click=\${next}>下一步</elf-button>`;

const script = `const steps = [
  { title: "创建项目", description: "填写名称和基础配置" },
  { title: "配置能力", description: "选择组件、主题和权限" },
  { title: "邀请成员", description: "添加协作者并分配角色" },
  { title: "发布上线", description: "确认设置并开始使用" }
];

const active = useRef(1);
const basicActive = useRef(1);
const lastAction = useRef("等待操作");

const onBasicUpdate = (event) => {
  basicActive.set(event.detail);
};

const onUpdateActive = (event) => {
  active.set(event.detail);
};

const onChange = (event) => {
  lastAction.set(\`切换到第 \${event.detail.active + 1} 步\`);
};

const next = () => {
  active.set(Math.min(steps.length - 1, active.value + 1));
};`;

const steps = [
  { title: "创建项目", description: "填写名称和基础配置" },
  { title: "配置能力", description: "选择组件、主题和权限" },
  { title: "邀请成员", description: "添加协作者并分配角色" },
  { title: "发布上线", description: "确认设置并开始使用" }
];

const active = useRef(1);
const basicActive = useRef(1);
const lastAction = useRef("等待操作");

const onBasicUpdate = (event: Event): void => {
  basicActive.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const onUpdateActive = (event: Event): void => {
  active.set(Number((event as CustomEvent<number>).detail ?? 0));
};

const onChange = (event: Event): void => {
  const detail = (event as CustomEvent<{ active: number }>).detail;
  lastAction.set(`切换到第 ${detail.active + 1} 步`);
};

const next = (): void => {
  active.set(Math.min(steps.length - 1, active.value + 1));
  lastAction.set(`切换到第 ${active.value + 1} 步`);
};

const prev = (): void => {
  active.set(Math.max(0, active.value - 1));
  lastAction.set(`切换到第 ${active.value + 1} 步`);
};

const PageStepsEx1 = defineHtml(html`
  <h2>基础与受控</h2>
  <elf-playground title="流程状态" :code=${code1} :script=${script}>
    <elf-steps
      :active=${basicActive}
      :items.prop=${steps}
      @update:active=${onBasicUpdate}
    ></elf-steps>
  </elf-playground>

  <elf-playground title="受控当前步骤" :code=${code2} :script=${script}>
    <elf-steps
      :active=${active}
      :items.prop=${steps}
      @update:active=${onUpdateActive}
      @change=${onChange}
    >
    </elf-steps>
    <div style="display:flex;gap:12px;align-items:center;margin-top:20px;flex-wrap:wrap">
      <elf-button variant="outlined" @click=${prev}>上一步</elf-button>
      <elf-button color="primary" @click=${next}>下一步</elf-button>
      <span style="font-size:13px;color:var(--elf-text-secondary)">{{ lastAction }}</span>
    </div>
  </elf-playground>
`);

export { PageStepsEx1 };
