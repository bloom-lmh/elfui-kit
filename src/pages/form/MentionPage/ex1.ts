import { defineHtml, html, useRef } from "elfui";

const content = useRef("请 @");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];

const code1 = `<elf-mention
  :options.prop=\${members}
  :modelValue=\${content}
  placeholder="输入 @ 选择成员"
  @update:modelValue=\${onContentUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const content = useRef("请 @");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];`;

const onContentUpdate = (event: CustomEvent): void => {
  content.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;

const PageMentionEx1 = defineHtml(html`
<elf-playground title="@ 成员" :code=${code1} :script=${script1}>
      <elf-mention
        :options.prop=${members}
        :modelValue=${content}
        placeholder="输入 @ 选择成员"
        @update:modelValue=${onContentUpdate}
        @select=${onSelect}
      ></elf-mention>
    </elf-playground>
`);

export { PageMentionEx1 };
