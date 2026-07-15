import { defineHtml, html, useRef } from "elfui";

const keyword = useRef("");
const suggestions = [
  { label: "设计系统", value: "design-system" },
  { label: "组件开发", value: "component-authoring" },
  { label: "可访问性", value: "accessibility" },
  { label: "自动化测试", value: "automated-testing" }
];

const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 10] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } }
  ]
};

const onUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const code = `<elf-autocomplete
  :modelValue=\${keyword}
  :options.prop=\${suggestions}
  :popperOptions.prop=\${popperOptions}
  teleported
  fit-input-width
  append-to="body"
  @update:modelValue=\${onUpdate}
/>`;

const PageAutocompleteEx4 = defineHtml(html`
  <h2>传送面板与视口定位</h2>
  <elf-playground title="teleported / offset / flip / preventOverflow" :code=${code}>
    <div
      style="width:min(100%,520px);height:120px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:12px;padding:18px;box-sizing:border-box;display:flex;align-items:flex-end"
    >
      <elf-autocomplete
        :modelValue=${keyword}
        :options.prop=${suggestions}
        :popperOptions.prop=${popperOptions}
        teleported
        fit-input-width
        append-to="body"
        placeholder="在裁切容器内搜索"
        @update:modelValue=${onUpdate}
      ></elf-autocomplete>
    </div>
  </elf-playground>
`);

export { PageAutocompleteEx4 };
