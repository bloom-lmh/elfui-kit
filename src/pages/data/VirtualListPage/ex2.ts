import { defineHtml, html } from "elfui";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "VirtualList 虚拟列表", en: "VirtualList" }, title: { zh: "10,000 条构建任务", en: "10,000 build tasks" },
  task: { zh: "构建任务", en: "Build task" }, running: { zh: "运行中", en: "Running" }, completed: { zh: "已完成", en: "Completed" },
  waiting: { zh: "等待中", en: "Waiting" }, status: { zh: "条 · 固定 44px 行高 · 仅渲染可视窗口", en: "rows · fixed 44px height · viewport-only rendering" }
});

const total = 10000;
const items = Array.from({ length: total }, (_, index) => ({ id: index, status: index % 3 }));
const renderItem = (item: unknown): Node => {
  const row = item as { id: number; status: number };
  const container = document.createElement("div");
  container.style.cssText = "display:flex;align-items:center;justify-content:space-between;width:100%";
  const title = document.createElement("span");
  title.textContent = `${t("task")} #${String(row.id + 1).padStart(5, "0")}`;
  const status = document.createElement("span");
  status.style.cssText = "color:var(--elf-text-secondary);font-size:12px";
  status.textContent = row.status === 0 ? t("running") : row.status === 1 ? t("completed") : t("waiting");
  container.append(title, status);
  return container;
};
const code = `<elf-virtual-list :items.prop="items" :renderItem.prop="renderItem" height="352" item-height="44" overscan="5" />`;
const script = `const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  title: \`构建任务 #\${String(index + 1).padStart(5, "0")}\`,
  status: index % 3 === 0 ? "运行中" : index % 3 === 1 ? "已完成" : "等待中"
}));

const renderItem = (item) => {
  const row = document.createElement("div");
  row.textContent = \`\${item.title} · \${item.status}\`;
  return row;
};`;
const PageVirtualListEx2 = defineHtml(html`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${total.toLocaleString()} ${t("status")}</span>
    <elf-virtual-list :key=${t("section")} style="width:100%;max-width:700px" :items.prop=${items} :renderItem.prop=${renderItem} height="352" item-height="44" overscan="5" bordered></elf-virtual-list>
  </elf-playground>
`);
export { PageVirtualListEx2 };
