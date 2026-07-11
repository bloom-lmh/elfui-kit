import { defineHtml, html } from "elfui";
import { useRef } from "elfui";

const stuck = useRef("未吸附");

const onChange = (event: CustomEvent): void => {
  stuck.set(event.detail ? "已吸附" : "未吸附");
};

const rows = Array.from({ length: 12 }, (_, index) => `内容行 ${index + 1}`);

const code = `<elf-sticky top="0" @change="onChange">
  <div class="toolbar">Toolbar</div>
</elf-sticky>`;

const PageStickyEx1 = defineHtml(html`
  <h2>顶部吸附</h2>
  <elf-playground title="top offset / change event" :code="code">
    <div
      style="width:100%;max-width:720px;height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
    >
      <elf-sticky
        top="0"
        @change="onChange"
        style="--sticky-shadow:0 8px 18px -16px rgba(0,0,0,.32)"
      >
        <div
          style="display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;background:var(--elf-bg-paper);border-bottom:1px solid var(--elf-divider)"
        >
          <strong>筛选工具栏</strong>
          <span style="color:var(--elf-text-secondary);font-size:13px">{{ stuck }}</span>
        </div>
      </elf-sticky>
      <div style="display:grid;gap:8px;padding:16px">
        <div
          v-for="row in rows"
          :key="row"
          style="height:36px;padding:0 12px;display:flex;align-items:center;border-radius:6px;background:var(--elf-bg-overlay)"
        >
          {{ row }}
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageStickyEx1 };
