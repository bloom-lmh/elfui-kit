import { defineHtml, html, useRef } from "elfui";

const active = useRef(["design"]);
const accordion = useRef("api");

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对标", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];

const code1 = `<elf-collapse
  :items.prop=\${items}
  :modelValue.prop=\${active}
  @update:modelValue=\${onActiveUpdate}
/>
<span class="demo-state">当前：\${active.join(", ")}</span>`;

const script1 = `const active = useRef(["design"]);

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对标", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];`;

const code2 = `<elf-collapse
  accordion
  :items.prop=\${items}
  :modelValue=\${accordion}
  @update:modelValue=\${onAccordionUpdate}
/>`;

const script2 = `const accordion = useRef("api");`;

const onActiveUpdate = (event: CustomEvent): void => {
  active.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onAccordionUpdate = (event: CustomEvent): void => {
  accordion.set(String(event.detail || ""));
};

const PageCollapse = defineHtml(html`
  <elf-container>
    <h1>Collapse 折叠面板</h1>
    <p>用于分组展示内容，支持多开、手风琴模式、禁用项和字段映射。</p>

    <elf-playground title="多面板受控" :code=${code1} :script=${script1}>
      <elf-collapse
        :items.prop=${items}
        :modelValue.prop=${active}
        @update:modelValue=${onActiveUpdate}
      ></elf-collapse>
      <span class="demo-state">当前：${active.value.join(", ")}</span>
    </elf-playground>

    <elf-playground title="accordion 手风琴" :code=${code2} :script=${script2}>
      <elf-collapse
        accordion
        :items.prop=${items}
        :modelValue=${accordion}
        @update:modelValue=${onAccordionUpdate}
      ></elf-collapse>
    </elf-playground>
  </elf-container>
`);

export { PageCollapse };
