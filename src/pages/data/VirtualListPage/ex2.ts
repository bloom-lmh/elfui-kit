import { defineHtml, html } from "elfui";

const total = 10000;
const items = Array.from({ length: total }, (_, index) => ({ id: index, title: `构建任务 #${String(index + 1).padStart(5, "0")}`, status: index % 3 === 0 ? "运行中" : index % 3 === 1 ? "已完成" : "等待中" }));
const renderItem = (item: unknown): Node => {
  const row = item as { title: string; status: string };
  const container = document.createElement("div");
  container.style.cssText = "display:flex;align-items:center;justify-content:space-between;width:100%";
  const title = document.createElement("span");
  title.textContent = row.title;
  const status = document.createElement("span");
  status.style.cssText = "color:var(--elf-text-secondary);font-size:12px";
  status.textContent = row.status;
  container.append(title, status);
  return container;
};
const code = `<elf-virtual-list :items.prop="items" :renderItem.prop="renderItem" height="352" item-height="44" overscan="5" />`;
const PageVirtualListEx2 = defineHtml(html`
  <h2>VirtualList 虚拟列表</h2>
  <elf-playground title="10,000 条构建任务" :code=${code}>
    <span slot="status" class="demo-state">${total.toLocaleString()} 条 · 固定 44px 行高 · 仅渲染可视窗口</span>
    <elf-virtual-list style="width:100%;max-width:700px" :items.prop=${items} :renderItem.prop=${renderItem} height="352" item-height="44" overscan="5" bordered></elf-virtual-list>
  </elf-playground>
`);
export { PageVirtualListEx2 };
