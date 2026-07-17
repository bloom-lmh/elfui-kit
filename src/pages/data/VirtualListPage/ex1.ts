import { defineHtml, html } from "elfui";

const items = [
  { id: 1, title: "设计系统评审", meta: "今天 10:30" },
  { id: 2, title: "组件回归测试", meta: "今天 14:00" },
  { id: 3, title: "发布候选版本", meta: "明天 09:00" }
];
const renderItem = (item: unknown): Node => {
  const row = item as { title: string; meta: string };
  const container = document.createElement("div");
  container.style.cssText = "display:flex;justify-content:space-between;gap:16px;width:100%";
  const title = document.createElement("strong");
  title.textContent = row.title;
  const meta = document.createElement("span");
  meta.style.color = "var(--elf-text-secondary)";
  meta.textContent = row.meta;
  container.append(title, meta);
  return container;
};
const PageVirtualListEx1 = defineHtml(html`
  <h2>List 列表</h2>
  <elf-playground title="结构化任务列表">
    <elf-list style="width:100%;max-width:620px" :items.prop=${items} :renderItem.prop=${renderItem} bordered></elf-list>
  </elf-playground>
`);
export { PageVirtualListEx1 };
