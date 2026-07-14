import { defineHtml, html } from "elfui";

const items = [
  { name: "design", title: "设计原则", content: "保持反馈清晰，减少用户等待感。" },
  { name: "api", title: "API 对齐", content: "逐项补齐 Element Plus 常用能力。" },
  { name: "disabled", title: "禁用项", content: "该项不可展开。", disabled: true }
];

const mappedItems = [
  { id: "security", label: "安全", detail: "通过 props 映射第三方或业务数据字段。" },
  { id: "billing", label: "账单", detail: "映射保持数据源无需转换。" }
];

const mappingCode = `<elf-collapse
  :items.prop="mappedItems"
  :props.prop="{ name: 'id', title: 'label', content: 'detail' }"
/>`;

const PageCollapseEx4 = defineHtml(html`
<elf-playground title="字段映射" :code=${mappingCode}>
      <elf-collapse :items.prop=${mappedItems} :props.prop=${{ name: "id", title: "label", content: "detail" }}></elf-collapse>
    </elf-playground>
`);

export { PageCollapseEx4 };
