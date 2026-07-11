import { defineHtml, html } from "elfui";
import { useReactive, useRef } from "elfui";

const query = useReactive({
  keyword: "",
  status: "",
  onlyMine: true
});

const result = useRef("等待筛选");

const statusOptions = [
  { label: "全部状态", value: "" },
  { label: "运行中", value: "running" },
  { label: "维护中", value: "maintenance" },
  { label: "告警", value: "warning" }
];

const search = (): void => {
  result.set(
    `筛选：${query.keyword || "全部"} / ${query.status || "全部状态"} / ${query.onlyMine ? "只看我" : "全部负责人"}`
  );
};

const code = `<elf-form :model.prop="query" inline label-position="left">
  <elf-form-item label="关键词"><elf-input v-model="query.keyword" /></elf-form-item>
  <elf-form-item label="状态"><elf-select v-model="query.status" :options.prop="statusOptions" /></elf-form-item>
</elf-form>`;

const PageFormEx2 = defineHtml(html`
  <h2>行内筛选</h2>
  <elf-playground title="inline / select / switch" :code="code">
    <div style="display:grid;gap:12px;width:100%">
      <elf-form :model.prop="query" inline label-position="left" label-width="72px">
        <elf-form-item label="关键词">
          <elf-input v-model="query.keyword" placeholder="服务名 / 负责人" clearable></elf-input>
        </elf-form-item>
        <elf-form-item label="状态">
          <elf-select v-model="query.status" :options.prop="statusOptions" clearable></elf-select>
        </elf-form-item>
        <elf-form-item label="只看我">
          <elf-switch v-model="query.onlyMine"></elf-switch>
        </elf-form-item>
        <elf-button type="primary" @click="search()">筛选</elf-button>
      </elf-form>
      <p class="demo-state">{{ result }}</p>
    </div>
  </elf-playground>
`);

export { PageFormEx2 };
