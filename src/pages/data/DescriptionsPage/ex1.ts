import { defineHtml, html } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "基础详情", en: "Basic details" },
  title: { zh: "任务详情", en: "Task details" },
  order: { zh: "订单号", en: "Order" },
  owner: { zh: "负责人", en: "Owner" },
  status: { zh: "状态", en: "Status" },
  priority: { zh: "优先级", en: "Priority" },
  note: { zh: "备注", en: "Note" },
  running: { zh: "进行中", en: "In progress" },
  high: { zh: "高", en: "High" },
  noteValue: { zh: "本轮优先补齐新增组件案例。", en: "Complete the new component examples in this iteration." }
});

const orderItems = () => [
  { label: t("order"), value: "ELF-20260707" },
  { label: t("owner"), value: "林舟 / Lin Zhou" },
  { label: t("status"), value: t("running") },
  { label: t("priority"), value: t("high") },
  { label: t("note"), value: t("noteValue"), span: 2 }
];
const code = `<elf-descriptions title="任务详情" extra="2026-07-07" :items.prop="orderItems" :column="2" />`;
const script = `const orderItems = [
  { label: "订单号", value: "ELF-20260707" },
  { label: "负责人", value: "林舟" },
  { label: "状态", value: "进行中" },
  { label: "优先级", value: "高" },
  { label: "备注", value: "本轮优先补齐新增组件案例。", span: 2 }
];`;

const PageDescriptionsEx1 = defineHtml(html`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("heading")} :code=${code} :script=${script}>
    <div style="width:min(760px,100%)">
      <elf-descriptions :title=${t("title")} extra="2026-07-07" :items.prop=${orderItems()} :column=${2}></elf-descriptions>
    </div>
  </elf-playground>
`);

export { PageDescriptionsEx1 };
