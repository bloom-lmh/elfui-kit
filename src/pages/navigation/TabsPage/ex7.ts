import { defineHtml, html, useRef } from "elfui";

const active = useRef<string | number>("overview");
const status = useRef("当前标签：概览");

const onUpdate = (event: CustomEvent<string | number>): void => {
  active.set(event.detail);
};

const onChange = (event: CustomEvent): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [event.detail];
  status.set(`当前标签：${String(detail[0])}`);
};

const onAdd = (): void => {
  status.set("触发新增标签事件");
};

const code = `<elf-tabs
  type="border-card"
  editable
  :modelValue.prop=\${active.value}
  @update:modelValue=\${onUpdate}
  @tab-change=\${onChange}
  @tab-add=\${onAdd}
>
  <span slot="add-icon">＋ 新建</span>
  <elf-tab-pane label="概览" name="overview">
    项目概览内容
  </elf-tab-pane>
  <elf-tab-pane name="tasks" lazy closable>
    <span slot="label"><strong>任务</strong><small>4</small></span>
    待处理任务内容，仅在首次激活后渲染。
  </elf-tab-pane>
  <elf-tab-pane label="审计" name="audit" disabled>
    审计内容
  </elf-tab-pane>
</elf-tabs>`;

const script = `const active = useRef("overview");

const onUpdate = (event) => {
  active.set(event.detail);
};

const onChange = (event) => {
  console.log("当前标签", event.detail);
};`;

const PageTabsEx7 = defineHtml(html`
  <h2>组合式标签面板</h2>
  <elf-playground title="TabPane、富标签与自定义新增按钮" :code=${code} :script=${script}>
    <elf-tabs
      type="border-card"
      editable
      :modelValue.prop=${active.value}
      @update:modelValue=${onUpdate}
      @tab-change=${onChange}
      @tab-add=${onAdd}
    >
      <span slot="add-icon">＋ 新建</span>
      <elf-tab-pane label="概览" name="overview">
        <h3 style="margin:0 0 8px">项目概览</h3>
        <p style="margin:0">集中查看项目状态、成员和最近活动。</p>
      </elf-tab-pane>
      <elf-tab-pane name="tasks" lazy closable>
        <span slot="label"><strong>任务</strong><small>4</small></span>
        <h3 style="margin:0 0 8px">待处理任务</h3>
        <p style="margin:0">该面板使用 lazy，仅在首次激活后创建内容。</p>
      </elf-tab-pane>
      <elf-tab-pane label="审计" name="audit" disabled>
        审计内容
      </elf-tab-pane>
    </elf-tabs>
    <span slot="status" class="demo-state">${status}</span>
  </elf-playground>
`);

export { PageTabsEx7 };
