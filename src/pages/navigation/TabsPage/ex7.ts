import { defineHtml, html, useRef } from "elfui";

interface DemoPane {
  name: string;
  label: string;
  content: string;
  disabled?: boolean;
  lazy?: boolean;
  closable?: boolean;
}

const active = useRef<string | number>("overview");
const status = useRef("当前标签：overview");
const serial = useRef(1);
const panes = useRef<DemoPane[]>([
  { name: "overview", label: "概览", content: "集中查看项目状态、成员和最近活动。", closable: true },
  { name: "tasks", label: "任务", content: "该面板使用 lazy，仅在首次激活后创建内容。", lazy: true, closable: true },
  { name: "audit", label: "审计", content: "审计标签禁用，不参与关闭后的激活回退。", disabled: true }
]);

const eventValue = (event: CustomEvent): string => {
  const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  return String(detail ?? "");
};

const onUpdate = (event: CustomEvent<string | number>): void => {
  active.set(event.detail);
};

const onChange = (event: CustomEvent): void => {
  status.set(`当前标签：${eventValue(event)}`);
};

const onAdd = (): void => {
  const value = `new-${serial.value}`;
  serial.set(serial.value + 1);
  panes.set([
    ...panes.value,
    { name: value, label: `新标签 ${serial.value - 1}`, content: `这是 ${value} 的动态面板。`, closable: true }
  ]);
  active.set(value);
  status.set(`已新增并激活：${value}`);
};

const onRemove = (event: CustomEvent): void => {
  const removed = eventValue(event);
  const source = panes.value;
  const removedIndex = source.findIndex((pane) => pane.name === removed);
  if (removedIndex < 0) return;

  const next = source.filter((pane) => pane.name !== removed);
  panes.set(next);

  if (String(active.value) === removed) {
    const fallback =
      next.find((pane, index) => !pane.disabled && index >= removedIndex) ??
      [...next].reverse().find((pane) => !pane.disabled);
    active.set(fallback?.name ?? "");
  }
  status.set(`已关闭：${removed}`);
};

const code = `<elf-tabs
  type="border-card"
  editable
  :modelValue.prop=\${active.value}
  @update:modelValue=\${onUpdate}
  @tab-change=\${onChange}
  @tab-add=\${onAdd}
  @tab-remove=\${onRemove}
>
  <span slot="add-icon">＋ 新建</span>
  <elf-tab-pane
    v-for="pane in panes.value"
    :key="pane.name"
    :label="pane.label"
    :name="pane.name"
    :disabled="pane.disabled"
    :lazy="pane.lazy"
    :closable="pane.closable"
  >
    {{ pane.content }}
  </elf-tab-pane>
</elf-tabs>`;

const script = `const active = useRef("overview");
const panes = useRef([
  { name: "overview", label: "概览", content: "项目概览", closable: true },
  { name: "tasks", label: "任务", content: "待处理任务", lazy: true, closable: true },
  { name: "audit", label: "审计", content: "审计内容", disabled: true }
]);

const onAdd = () => {
  const name = createUniqueName();
  panes.set([...panes.value, { name, label: "新标签", content: "动态内容", closable: true }]);
  active.set(name);
};

const onRemove = (event) => {
  const removed = event.detail[0];
  panes.set(panes.value.filter((pane) => pane.name !== removed));
  // 当前项被关闭时，优先激活右侧可用项，否则回退到左侧。
};`;

const PageTabsEx7 = defineHtml(html`
  <h2>组合式标签面板</h2>
  <elf-playground title="TabPane、动态新建与关闭回退" :code=${code} :script=${script}>
    <elf-tabs
      type="border-card"
      editable
      :modelValue.prop=${active.value}
      @update:modelValue=${onUpdate}
      @tab-change=${onChange}
      @tab-add=${onAdd}
      @tab-remove=${onRemove}
    >
      <span slot="add-icon">＋ 新建</span>
      <elf-tab-pane
        v-for="pane in panes.value"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled"
        :lazy="pane.lazy"
        :closable="pane.closable"
      >
        <h3 style="margin:0 0 8px">{{ pane.label }}</h3>
        <p style="margin:0">{{ pane.content }}</p>
      </elf-tab-pane>
    </elf-tabs>
    <span slot="status" class="demo-state">${status}</span>
  </elf-playground>
`);

export { PageTabsEx7 };
