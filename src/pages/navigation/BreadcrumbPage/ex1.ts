import { defineHtml, html, useRef } from "@elfui/core";


const lastClick = useRef("尚未点击");

const items = [
  { label: "首页", to: "/" },
  { label: "数据展示", to: "/data" },
  { label: "Table 表格", to: "/data/table" }
];

const onClick = (event: CustomEvent): void => {
  lastClick.set(String(event.detail[1] || ""));
};

const code = `<elf-breadcrumb :items="items" @click="onClick"></elf-breadcrumb>`;

const script = `const items = [
  { label: "首页", to: "/" },
  { label: "数据展示", to: "/data" },
  { label: "Table 表格", to: "/data/table" }
];`;

const PageBreadcrumbEx1 = defineHtml(html`
  <h2>基础用法</h2>
  <elf-playground title="路径层级 / 点击反馈" :code=${code} :script=${script}>
    <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:760px">
      <elf-breadcrumb :items=${items} @click=${onClick}></elf-breadcrumb>
      <div style="color:var(--elf-text-secondary);font-size:14px">
        最近点击：<strong style="color:var(--elf-primary)">{{ lastClick }}</strong>
      </div>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx1 };
