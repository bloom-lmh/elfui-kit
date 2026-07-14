import { defineHtml, html } from "elfui";

const orderItems = [
  { label: "订单号", value: "ELF-20260707" },
  { label: "负责人", value: "林舟" },
  { label: "状态", value: "进行中" },
  { label: "备注", value: "本轮优先补齐新增组件案例。", span: 3 }
];

const code1 = `<elf-descriptions
  title="任务详情"
  extra="2026-07-07"
  :items.prop=\${orderItems}
  :column=\${3}
/>`;

const script1 = `const orderItems = [
  { label: "订单号", value: "ELF-20260707" },
  { label: "负责人", value: "林舟" },
  { label: "状态", value: "进行中" },
  { label: "备注", value: "本轮优先补齐新增组件案例。", span: 3 }
];`;

const PageDescriptionsEx1 = defineHtml(html`
<elf-playground title="基础详情" :code=${code1} :script=${script1}>
      <elf-descriptions
        title="任务详情"
        extra="2026-07-07"
        :items.prop=${orderItems}
        :column=${3}
      ></elf-descriptions>
    </elf-playground>
`);

export { PageDescriptionsEx1 };
