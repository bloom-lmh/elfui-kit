import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageCollapseProps } from "./props";

useComponents({
  "page-collapse-props": PageCollapseProps
});

const active = useRef(["design"]);
const accordion = useRef("api");
const slottedActive = useRef(["guide"]);

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

const code2 = `<elf-collapse
  accordion
  :items.prop="items"
  :modelValue="accordion"
  @update:modelValue="onAccordionUpdate"
/>`;

const script2 = `const accordion = useRef("api");`;

const slotCode = `<elf-collapse :modelValue.prop="slottedActive" @update:modelValue="onSlottedUpdate">
  <elf-collapse-item name="guide" title="组合式用法">
    默认 slot 承载面板内容。
  </elf-collapse-item>
  <elf-collapse-item name="custom">
    <span slot="title">自定义标题</span>
    <span slot="icon">+</span>
    title 与 icon 都可通过 slot 替换。
  </elf-collapse-item>
</elf-collapse>`;

const slotScript = `const slottedActive = useRef(["guide"]);`;

const mappedItems = [
  { id: "security", label: "安全", detail: "通过 props 映射第三方或业务数据字段。" },
  { id: "billing", label: "账单", detail: "映射保持数据源无需转换。" }
];

const mappingCode = `<elf-collapse
  :items.prop="mappedItems"
  :props.prop="{ name: 'id', title: 'label', content: 'detail' }"
/>`;

const onActiveUpdate = (event: CustomEvent): void => {
  active.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onAccordionUpdate = (event: CustomEvent): void => {
  accordion.set(String(event.detail || ""));
};

const onSlottedUpdate = (event: CustomEvent): void => {
  slottedActive.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageCollapse = defineHtml(html`
  <elf-container>
    <h1>Collapse 折叠面板</h1>
    <p>用于分组展示内容，支持多开、手风琴模式、禁用项、字段映射和组合式子面板。</p>

    <elf-playground title="数据驱动面板" :code=${code1} :script=${script1}>
      <elf-collapse :items.prop=${items} :modelValue.prop=${active} @update:modelValue=${onActiveUpdate}></elf-collapse>
      <span class="demo-state">当前：{{ active.value.join(", ") }}</span>
    </elf-playground>

    <elf-playground title="手风琴模式" :code=${code2} :script=${script2}>
      <elf-collapse accordion :items.prop=${items} :modelValue=${accordion} @update:modelValue=${onAccordionUpdate}></elf-collapse>
    </elf-playground>

    <elf-playground title="组合式折叠面板" :code=${slotCode} :script=${slotScript}>
      <elf-collapse :modelValue.prop=${slottedActive} @update:modelValue=${onSlottedUpdate}>
        <elf-collapse-item name="guide" title="组合式用法">默认 slot 承载面板内容。</elf-collapse-item>
        <elf-collapse-item name="custom">
          <span slot="title">自定义标题</span>
          <span slot="icon">+</span>
          title 与 icon 都可通过 slot 替换。
        </elf-collapse-item>
      </elf-collapse>
    </elf-playground>

    <elf-playground title="字段映射" :code=${mappingCode}>
      <elf-collapse :items.prop=${mappedItems} :props.prop=${{ name: "id", title: "label", content: "detail" }}></elf-collapse>
    </elf-playground>

    <page-collapse-props></page-collapse-props>
  </elf-container>
`);

export { PageCollapse };
