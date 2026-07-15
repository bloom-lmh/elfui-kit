import { defineHtml, html, useRef } from "elfui";

const current = useRef("尚未导航");

const onClick = (event: CustomEvent<[Record<string, unknown>, string]>): void => {
  current.set(event.detail[1]);
};

const code = `<elf-breadcrumb separator-icon="chevron_right" @click=\${onClick}>
  <elf-breadcrumb-item to="/">首页</elf-breadcrumb-item>
  <elf-breadcrumb-item :to=\${{ path: "/components" }} replace>组件</elf-breadcrumb-item>
  <elf-breadcrumb-item>Breadcrumb</elf-breadcrumb-item>
</elf-breadcrumb>`;

const script = `const onClick = (event) => console.log(event.detail[1]);`;

const PageBreadcrumbEx3 = defineHtml(html`
  <h2>组合式用法</h2>
  <elf-playground title="BreadcrumbItem / separator-icon" :code=${code} :script=${script}>
    <div style="display:grid;gap:14px;width:100%;max-width:760px">
      <elf-breadcrumb separator-icon="chevron_right" @click=${onClick}>
        <elf-breadcrumb-item to="/">首页</elf-breadcrumb-item>
        <elf-breadcrumb-item :to=${{ path: "/components" }} replace>组件</elf-breadcrumb-item>
        <elf-breadcrumb-item>Breadcrumb</elf-breadcrumb-item>
      </elf-breadcrumb>
      <span style="color:var(--elf-text-secondary);font-size:14px">最近导航：<strong>{{ current }}</strong></span>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx3 };
