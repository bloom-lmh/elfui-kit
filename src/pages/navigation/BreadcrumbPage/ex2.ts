import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const routeText = useRef(window.location.hash || "#/");

const docs = [
  { name: "组件", path: "/components" },
  { name: "Navigation", path: "/components/navigation" },
  { name: "Breadcrumb", path: "/components/navigation/breadcrumb" },
  { name: "API", path: "/components/navigation/breadcrumb/api" }
];

const fields = { label: "name", to: "path", disabled: "locked" };

const onClick = (): void => {
  requestAnimationFrame(() => routeText.set(window.location.hash || "#/"));
};

const code = `<elf-breadcrumb
  :items="docs"
  :props.prop="{ label: 'name', to: 'path', disabled: 'locked' }"
  separator="|"
  router
  :maxItems.prop="3"
  @click="onClick"
/>`;

const PageBreadcrumbEx2 = defineHtml(html`
  <h2>路由与自定义字段</h2>
  <elf-playground title="router / props / maxItems" :code="code">
    <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:760px">
      <elf-breadcrumb
        :items="docs"
        :props.prop="fields"
        separator="|"
        router
        :maxItems.prop="3"
        @click="onClick"
      ></elf-breadcrumb>
      <div style="color:var(--elf-text-secondary);font-size:14px">
        当前 hash：<strong style="color:var(--elf-primary)">{{ routeText }}</strong>
      </div>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx2 };
