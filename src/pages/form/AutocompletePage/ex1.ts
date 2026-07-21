import { defineHtml, html, useRef } from "@elfui/core";

const keyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const code1 = `<elf-autocomplete
  :options.prop=\${suggestions}
  :modelValue.prop=\${keyword}
  clearable
  placeholder="输入框架名"
  @update:modelValue=\${onKeywordUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const keyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const onKeywordUpdate = (event) => {
  keyword.set(event.detail);
};`;

const onKeywordUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;

const PageAutocompleteEx1 = defineHtml(html`
<h2>基础</h2>
<elf-playground title="本地建议与清空" :code=${code1} :script=${script1}>
      <elf-autocomplete
        :options.prop=${suggestions}
        :modelValue.prop=${keyword}
        label="前端框架"
        clearable
        placeholder="输入框架名"
        @update:modelValue=${onKeywordUpdate}
        @select=${onSelect}
      ></elf-autocomplete>
    </elf-playground>
`);

export { PageAutocompleteEx1 };
