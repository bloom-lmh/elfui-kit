import { defineHtml, html } from "elfui";

const profileItems = [
  { label: "用户名", value: "elf-admin" },
  { label: "角色", value: "Maintainer" },
  { label: "环境", value: "Playground" },
  { label: "说明", value: "vertical + border 展示更适合详情页。", span: 3 }
];

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

const PageDescriptionsEx2 = defineHtml(html`
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
`);

export { PageDescriptionsEx2 };
