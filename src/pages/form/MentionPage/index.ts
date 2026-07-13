import { defineHtml, html, useComponents, useRef } from "elfui";
import { PageMentionProps } from "./props";

useComponents({ "page-mention-props": PageMentionProps });
const keyboardContent = useRef("@");

const content = useRef("请 @");
const hashContent = useRef("发布到 #");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];

const topics = [
  { label: "版本发布", value: "release" },
  { label: "组件设计", value: "design" },
  { label: "缺陷排查", value: "bugfix" }
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

const code2 = `<elf-mention
  prefix="#"
  rows="4"
  :options.prop=\${topics}
  :modelValue=\${hashContent}
  placeholder="输入 # 选择话题"
  @update:modelValue=\${onHashUpdate}
/>`;

const script2 = `const hashContent = useRef("发布到 #");

const topics = [
  { label: "版本发布", value: "release" },
  { label: "组件设计", value: "design" },
  { label: "缺陷排查", value: "bugfix" }
];`;

const onContentUpdate = (event: CustomEvent): void => {
  content.set(String(event.detail || ""));
};

const onHashUpdate = (event: CustomEvent): void => {
  hashContent.set(String(event.detail || ""));
};

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardContent.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;

const PageMention = defineHtml(html`
  <elf-container>
    <h1>Mention 提及</h1>
    <p>在文本输入中通过前缀触发候选面板，适合选择成员、话题或实体。</p>

    <elf-playground title="@ 成员" :code=${code1} :script=${script1}>
      <elf-mention
        :options.prop=${members}
        :modelValue=${content}
        placeholder="输入 @ 选择成员"
        @update:modelValue=${onContentUpdate}
        @select=${onSelect}
      ></elf-mention>
    </elf-playground>

    <elf-playground title="自定义触发前缀与行数" :code=${code2} :script=${script2}>
      <elf-mention
        prefix="#"
        rows="4"
        :options.prop=${topics}
        :modelValue=${hashContent}
        placeholder="输入 # 选择话题"
        @update:modelValue=${onHashUpdate}
      ></elf-mention>
    </elf-playground>
    <elf-playground title="键盘选择">
      <div style="display:grid;gap:10px;max-width:480px">
        <elf-mention
          :modelValue=${keyboardContent}
          :options.prop=${members}
          aria-label="使用键盘选择成员"
          @update:modelValue=${onKeyboardUpdate}
        ></elf-mention>
        <span class="demo-state">输入 @ 后，使用 ↑ / ↓ 切换候选项，按 Enter 确认。</span>
      </div>
    </elf-playground>
    <page-mention-props></page-mention-props>
  </elf-container>
`);

export { PageMention };
