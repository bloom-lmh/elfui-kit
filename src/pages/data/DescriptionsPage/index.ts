import { defineHtml, html } from "elfui";

const orderItems = [
  { label: "订单号", value: "ELF-20260707" },
  { label: "负责人", value: "林舟" },
  { label: "状态", value: "进行中" },
  { label: "备注", value: "本轮优先补齐新增组件案例。", span: 3 }
];

const profileItems = [
  { label: "用户名", value: "elf-admin" },
  { label: "角色", value: "Maintainer" },
  { label: "环境", value: "Playground" },
  { label: "说明", value: "vertical + border 展示更适合详情页。", span: 3 }
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

const code2 = `<elf-descriptions
  title="账号信息"
  border
  direction="vertical"
  size="lg"
  :items.prop=\${profileItems}
  :column=\${3}
/>`;

const script2 = `const profileItems = [
  { label: "用户名", value: "elf-admin" },
  { label: "角色", value: "Maintainer" },
  { label: "环境", value: "Playground" },
  { label: "说明", value: "vertical + border 展示更适合详情页。", span: 3 }
];`;

const PageDescriptions = defineHtml(html`
  <elf-container>
    <h1>Descriptions 描述列表</h1>
    <p>成组展示键值信息，支持列数、边框、垂直布局、尺寸和字段 span。</p>

    <elf-playground title="基础详情" :code=${code1} :script=${script1}>
      <elf-descriptions
        title="任务详情"
        extra="2026-07-07"
        :items.prop=${orderItems}
        :column=${3}
      ></elf-descriptions>
    </elf-playground>

    <elf-playground title="border / vertical / size" :code=${code2} :script=${script2}>
      <elf-descriptions
        title="账号信息"
        border
        direction="vertical"
        size="lg"
        :items.prop=${profileItems}
        :column=${3}
      ></elf-descriptions>
    </elf-playground>
  </elf-container>
`);

export { PageDescriptions };
