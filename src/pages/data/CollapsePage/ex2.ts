import { defineHtml, html, useRef } from "@elfui/core";

const accordion = useRef("api");

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对齐", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];

const code2 = `<elf-collapse
  accordion
  :items.prop="items"
  :modelValue="accordion"
  @update:modelValue="onAccordionUpdate"
/>`;

const script2 = `const accordion = useRef("api");`;

const onAccordionUpdate = (event: CustomEvent): void => {
  accordion.set(String(event.detail || ""));
};

const PageCollapseEx2 = defineHtml(html`
<elf-playground title="手风琴模式" :code=${code2} :script=${script2}>
      <elf-collapse accordion :items.prop=${items} :modelValue=${accordion} @update:modelValue=${onAccordionUpdate}></elf-collapse>
    </elf-playground>
`);

export { PageCollapseEx2 };
