import { defineHtml, html, useRef } from "@elfui/core";

const active = useRef(["design"]);

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对齐", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];

const code1 = `<elf-collapse
  :items.prop="items"
  :modelValue.prop="active"
  @update:modelValue="onActiveUpdate"
/>`;

const script1 = `const active = useRef(["design"]);

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对齐", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];`;

const onActiveUpdate = (event: CustomEvent): void => {
  active.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageCollapseEx1 = defineHtml(html`
<elf-playground title="数据驱动面板" :code=${code1} :script=${script1}>
      <elf-collapse :items.prop=${items} :modelValue.prop=${active} @update:modelValue=${onActiveUpdate}></elf-collapse>
      <span slot="status" class="demo-state">当前：{{ active.value.join(", ") }}</span>
    </elf-playground>
`);

export { PageCollapseEx1 };
