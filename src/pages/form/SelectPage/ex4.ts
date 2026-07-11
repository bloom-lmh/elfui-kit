import { defineHtml, html, useRef } from "elfui";
import { customOptions, optionFields, opts, remoteSource } from "./shared";

const remoteOptions = useRef(remoteSource.slice(0, 2));
const remoteLoading = useRef(false);

const code1 = `<div style="width:240px;margin-bottom:8px">
  <elf-select
    :options.prop=\${opts}
    filterable
    allow-create
    default-first-option
    placeholder="输入后可创建"
  />
</div>
<div style="width:240px;margin-bottom:8px">
  <elf-select
    :options.prop=\${remoteOptions}
    :loading=\${remoteLoading}
    filterable
    remote
    :remote-method.prop=\${remoteMethod}
    placeholder="输入城市搜索"
  />
</div>
<div style="width:240px">
  <elf-select
    :options.prop=\${customOptions}
    :props.prop=\${optionFields}
    value-key="id"
    placeholder="字段映射"
  />
</div>`;

const script1 = `const remoteOptions = useRef([]);
const remoteLoading = useRef(false);

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" }
];

const remoteSource = [
  { value: "beijing", label: "北京" },
  { value: "shanghai", label: "上海" },
  { value: "shenzhen", label: "深圳" },
  { value: "hangzhou", label: "杭州" },
  { value: "chengdu", label: "成都" }
];

const customOptions = [
  { id: "designer", name: "设计师" },
  { id: "engineer", name: "工程师" },
  { id: "pm", name: "产品经理", locked: true }
];

const optionFields = {
  value: "id",
  label: "name",
  disabled: "locked"
};

const remoteMethod = (query) => {
  remoteLoading.set(true);
  const keyword = query.trim().toLowerCase();
  setTimeout(() => {
    remoteOptions.set(
      remoteSource.filter((item) => item.label.includes(query) || item.value.includes(keyword))
    );
    remoteLoading.set(false);
  }, 260);
};`;

const remoteMethod = (query: string): void => {
  remoteLoading.set(true);
  const keyword = String(query || "")
    .trim()
    .toLowerCase();
  window.setTimeout(() => {
    remoteOptions.set(
      remoteSource.filter(
        (item) => item.label?.includes(query) || String(item.value).includes(keyword)
      )
    );
    remoteLoading.set(false);
  }, 260);
};

const PageSelectEx4 = defineHtml(html`
  <elf-playground
    title="filterable / allow-create / remote / props 字段映射"
    :code=${code1}
    :script=${script1}
  >
    <div style="width:240px;margin-bottom:8px">
      <elf-select
        :options.prop=${opts}
        filterable
        allow-create
        default-first-option
        placeholder="输入后可创建"
      ></elf-select>
    </div>
    <div style="width:240px;margin-bottom:8px">
      <elf-select
        :options.prop=${remoteOptions}
        :loading=${remoteLoading}
        filterable
        remote
        :remoteMethod.prop=${remoteMethod}
        placeholder="输入城市搜索"
      ></elf-select>
    </div>
    <div style="width:240px">
      <elf-select
        :options.prop=${customOptions}
        :props.prop=${optionFields}
        value-key="id"
        placeholder="字段映射"
      ></elf-select>
    </div>
  </elf-playground>
`);

export { PageSelectEx4 };
