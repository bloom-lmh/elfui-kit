import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageAutocompleteProps } from "./props";

useComponents({ "page-autocomplete-props": PageAutocompleteProps });

const keyword = useRef("");
const remoteKeyword = useRef("");
const keyboardKeyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const fetchSuggestions = async (query: string) => {
  const source = [
    { label: "杭州 West Lake", value: "Hangzhou" },
    { label: "上海 Pudong", value: "Shanghai" },
    { label: "深圳 Nanshan", value: "Shenzhen" },
    { label: "北京 Chaoyang", value: "Beijing" }
  ];
  return source.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};

const code1 = `<elf-autocomplete
  :options.prop=\${suggestions}
  :modelValue=\${keyword}
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

const code2 = `<elf-autocomplete
  :fetchSuggestions.prop=\${fetchSuggestions}
  :modelValue=\${remoteKeyword}
  placeholder="远程搜索城市"
  @update:modelValue=\${onRemoteUpdate}
/>`;

const script2 = `const remoteKeyword = useRef("");

const fetchSuggestions = async (query) => {
  const source = [
    { label: "杭州 West Lake", value: "Hangzhou" },
    { label: "上海 Pudong", value: "Shanghai" },
    { label: "深圳 Nanshan", value: "Shenzhen" },
    { label: "北京 Chaoyang", value: "Beijing" }
  ];
  return source.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
};`;

const code3 = `<elf-autocomplete
  :modelValue=\${keyboardKeyword}
  :options.prop=\${suggestions}
  :highlightFirstItem=\${true}
  placement="top-start"
  aria-label="Framework search"
  @update:modelValue=\${onKeyboardUpdate}
/>`;

const script3 = `const keyboardKeyword = useRef("");

const onKeyboardUpdate = (event) => {
  keyboardKeyword.set(event.detail);
};`;

const onKeywordUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const onRemoteUpdate = (event: CustomEvent): void => {
  remoteKeyword.set(String(event.detail || ""));
};

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardKeyword.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;

const PageAutocomplete = defineHtml(html`
  <elf-container>
    <h1>Autocomplete 自动补全</h1>
    <p>基于输入内容展示建议项，支持本地 options、异步 fetchSuggestions、清空和选中事件。</p>

    <elf-playground title="本地建议 / clearable" :code=${code1} :script=${script1}>
      <elf-autocomplete
        :options.prop=${suggestions}
        :modelValue=${keyword}
        clearable
        placeholder="输入框架名"
        @update:modelValue=${onKeywordUpdate}
        @select=${onSelect}
      ></elf-autocomplete>
    </elf-playground>

    <elf-playground title="异步建议" :code=${code2} :script=${script2}>
      <elf-autocomplete
        :fetchSuggestions.prop=${fetchSuggestions}
        :modelValue=${remoteKeyword}
        placeholder="远程搜索城市"
        @update:modelValue=${onRemoteUpdate}
      ></elf-autocomplete>
    </elf-playground>
    <elf-playground title="Keyboard navigation / top placement" :code=${code3} :script=${script3}>
      <elf-autocomplete
        :modelValue=${keyboardKeyword}
        :options.prop=${suggestions}
        :highlightFirstItem=${true}
        placement="top-start"
        aria-label="Framework search"
        @update:modelValue=${onKeyboardUpdate}
      ></elf-autocomplete>
    </elf-playground>
    <page-autocomplete-props></page-autocomplete-props>
  </elf-container>
`);

export { PageAutocomplete };
