import { defineHtml, html, useRef } from "elfui";

const active = useRef(1);
const statusText = useRef("当前步骤：配置能力");
const titles = ["创建项目", "配置能力", "邀请成员", "发布上线"];

const onUpdateActive = (event: CustomEvent<number>): void => {
  active.set(event.detail);
};

const onChange = (event: CustomEvent<{ active: number }>): void => {
  statusText.set(`当前步骤：${titles[event.detail.active] ?? "未知"}`);
};

const code = `<elf-steps
  :active.prop=\${active.value}
  @update:active=\${onUpdateActive}
  @change=\${onChange}
>
  <elf-step title="创建项目" description="填写名称和基础配置">
    <span slot="icon">1</span>
  </elf-step>
  <elf-step title="配置能力">
    <span slot="icon">⚙</span>
    <strong slot="title">配置能力</strong>
    <span slot="description">选择组件、主题和权限</span>
  </elf-step>
  <elf-step title="邀请成员" description="该步骤暂不可跳转" disabled />
  <elf-step title="发布上线" description="确认设置并开始使用" />
</elf-steps>`;

const script = `const active = useRef(1);
const titles = ["创建项目", "配置能力", "邀请成员", "发布上线"];

const onUpdateActive = (event) => {
  active.set(event.detail);
};

const onChange = (event) => {
  console.log("当前步骤", titles[event.detail.active]);
};`;

const PageStepsEx3 = defineHtml(html`
  <h2>组合式步骤与插槽</h2>
  <elf-playground title="自定义步骤内容" :code=${code} :script=${script}>
    <elf-steps
      :active.prop=${active.value}
      @update:active=${onUpdateActive}
      @change=${onChange}
    >
      <elf-step title="创建项目" description="填写名称和基础配置">
        <span slot="icon">1</span>
      </elf-step>
      <elf-step title="配置能力">
        <span slot="icon">⚙</span>
        <strong slot="title">配置能力</strong>
        <span slot="description">选择组件、主题和权限</span>
      </elf-step>
      <elf-step title="邀请成员" description="该步骤暂不可跳转" disabled></elf-step>
      <elf-step title="发布上线" description="确认设置并开始使用"></elf-step>
    </elf-steps>
    <span slot="status" class="demo-state">${statusText}</span>
  </elf-playground>
`);

export { PageStepsEx3 };
