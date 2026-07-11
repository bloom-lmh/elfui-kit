import { defineHtml, html, useRef } from "elfui";

const verticalSteps = [
  { title: "提交申请", description: "申请单已进入审批流程", status: "finish" },
  { title: "主管审批", description: "当前等待主管处理", status: "process" },
  { title: "财务复核", description: "该步骤暂不可跳转", disabled: true },
  { title: "归档完成", description: "审批通过后自动归档" }
];

const statusSteps = [
  { title: "已完成", description: "结果已同步", status: "finish" },
  { title: "处理中", description: "任务正在运行", status: "process" },
  { title: "需处理", description: "配置校验失败", status: "error" },
  { title: "等待中", description: "尚未开始", status: "wait" }
];

const iconSteps = [
  { title: "账号", description: "验证身份", icon: "ID" },
  { title: "安全", description: "配置双因素认证", icon: "2FA" },
  { title: "完成", description: "进入控制台", icon: "OK" }
];

const code1 = `<elf-steps direction="vertical" :active=\${1} :items=\${steps} />`;
const code2 = `<elf-steps :active=\${1} :items=\${steps} alternative-label />`;
const code3 = `<div class="steps-panel-demo">
  <elf-steps
    :active=\${panelActive}
    :items=\${panelSteps}
    @update:active=\${onPanelActive}
  />
  <section>
    <h3>{{ currentPanel().title }}</h3>
    <p>{{ currentPanel().content }}</p>
  </section>
</div>`;
const code4 = `<elf-steps
  :active=\${1}
  :items=\${steps}
  :space=\${180}
  process-status="error"
  finish-status="finish"
  align-center
/>

<elf-steps
  :active=\${1}
  :items=\${steps}
  simple
/>`;

const script = `const steps = [
  { title: "提交申请", description: "申请单已进入审批流程", status: "finish" },
  { title: "主管审批", description: "当前等待主管处理", status: "process" },
  { title: "财务复核", description: "该步骤暂不可跳转", disabled: true },
  { title: "归档完成", description: "审批通过后自动归档" }
];`;

const panelScript = `const panelActive = useRef(1);

const panelSteps = [
  { title: "基础信息", description: "填写项目名称" },
  { title: "权限配置", description: "选择角色和范围" },
  { title: "发布确认", description: "检查配置并上线" }
];

const panelDetails = [
  { title: "基础信息", content: "收集项目名称、归属团队和默认环境。" },
  { title: "权限配置", content: "配置成员角色、资源边界和审批规则。" },
  { title: "发布确认", content: "检查变更摘要，确认后推送到生产环境。" }
];

const currentPanel = () => panelDetails[panelActive.value] || panelDetails[0];

const onPanelActive = (event) => {
  panelActive.set(event.detail);
};`;

const panelActive = useRef(1);

const panelSteps = [
  { title: "基础信息", description: "填写项目名称" },
  { title: "权限配置", description: "选择角色和范围" },
  { title: "发布确认", description: "检查配置并上线" }
];

const panelDetails = [
  { title: "基础信息", content: "收集项目名称、归属团队和默认环境。" },
  { title: "权限配置", content: "配置成员角色、资源边界和审批规则。" },
  { title: "发布确认", content: "检查变更摘要，确认后推送到生产环境。" }
];

const currentPanel = (): { title: string; content: string } =>
  panelDetails[panelActive.value] || panelDetails[0]!;

const onPanelActive = (event: CustomEvent<number>): void => {
  panelActive.set(event.detail);
};

const PageStepsEx2 = defineHtml(html`
  <h2>状态、图标与布局</h2>
  <elf-playground title="垂直步骤" :code=${code1} :script=${script}>
    <div style="max-width:520px">
      <elf-steps direction="vertical" :active=${1} :items=${verticalSteps}></elf-steps>
    </div>
  </elf-playground>

  <elf-playground title="明确状态" :code=${code2} :script=${script}>
    <elf-steps :active=${1} :items=${statusSteps} alternative-label></elf-steps>
  </elf-playground>

  <elf-playground title="自定义图标与尺寸" :code=${code2} :script=${script}>
    <elf-steps :active=${1} :items=${iconSteps} size="lg"></elf-steps>
  </elf-playground>

  <elf-playground title="间距、居中与简洁模式" :code=${code4} :script=${script}>
    <div style="display:flex;flex-direction:column;gap:18px">
      <elf-steps
        :active=${1}
        :items=${statusSteps}
        :space=${180}
        process-status="error"
        finish-status="finish"
        align-center
      ></elf-steps>
      <elf-steps :active=${1} :items=${iconSteps} simple></elf-steps>
    </div>
  </elf-playground>

  <elf-playground title="步骤面板" :code=${code3} :script=${panelScript}>
    <div
      style="display:grid;grid-template-columns:minmax(360px,1fr) minmax(260px,.7fr);gap:24px;align-items:start;width:100%"
    >
      <elf-steps
        :active=${panelActive}
        :items=${panelSteps}
        @update:active=${onPanelActive}
      ></elf-steps>
      <section
        style="min-height:132px;padding:20px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);box-shadow:var(--elf-shadow-1)"
      >
        <h3 style="margin:0 0 8px;font-size:18px">{{ currentPanel().title }}</h3>
        <p style="margin:0;color:var(--elf-text-secondary);line-height:1.7">
          {{ currentPanel().content }}
        </p>
      </section>
    </div>
  </elf-playground>
`);

export { PageStepsEx2 };
