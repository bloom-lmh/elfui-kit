import { defineHtml, html, useRef } from "elfui";
import { opts } from "./shared";

const single = useRef("");

const code1 = `<div style="width:240px">
  <elf-select
    :options.prop=\${opts}
    :modelValue=\${single}
    placeholder="选个框架"
    @update:modelValue=\${onSingleUpdate}
  />
</div>
<span slot="status" class="demo-state">当前：{{ single || '未选' }}</span>`;

const script1 = `const single = useRef("");

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "elfui", label: "ElfUI" },
  { value: "lit", label: "Lit" }
];

const onSingleUpdate = (event) => {
  single.set(event.detail);
};`;

const onSingleUpdate = (event: CustomEvent): void => {
  single.set(String(event.detail || ""));
};

const PageSelectEx1 = defineHtml(html`
  <elf-playground title="基础单选" :code=${code1} :script=${script1}>
    <div style="width:240px">
      <elf-select
        :options.prop=${opts}
        :modelValue=${single}
        placeholder="选个框架"
        @update:modelValue=${onSingleUpdate}
      ></elf-select>
    </div>
    <span slot="status" class="demo-state">当前：{{ single || '未选' }}</span>
  </elf-playground>
`);

export { PageSelectEx1 };
