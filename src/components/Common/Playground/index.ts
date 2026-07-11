// elf-playground — 组件展示容器
//
// 用法：
//   const code = `<elf-button disabled>禁用</elf-button>`
//
//   <elf-playground title="基础用法" :code="code">
//     <elf-button>OK</elf-button>
//   </elf-playground>
//
// 默认 slot：渲染区（左侧/上方放真实组件）
// code prop：源码字符串，通过 :code="变量" 传入，<pre><code> 纯文本展示

import { defineProps, defineStyle, html, useRef, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { PlaygroundProps } from "./types";

export type { PlaygroundProps } from "./types";

const props = defineProps({
  title: { type: String, default: "" },
  code: { type: String, default: "" },
  script: { type: String, default: "" }
}) as unknown as Readonly<PlaygroundProps>;

const copied = useRef(false);
const activeTab = useRef<"template" | "script">("template");

const normalizeCode = (value: string): string => {
  const text = String(value || "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  while (lines.length > 0 && !lines[0]!.trim()) lines.shift();
  while (lines.length > 0 && !lines[lines.length - 1]!.trim()) lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(Math.min(min, line.length))).join("\n");
};

const templateCode = (): string => normalizeCode(props.code);

const scriptCode = (): string => normalizeCode(props.script);

const hasScript = (): boolean => scriptCode().length > 0;

const hasSource = (): boolean => templateCode().length > 0 || hasScript();

const showTabs = (): boolean => hasSource();

const setTemplateTab = (): void => {
  activeTab.set("template");
};

const setScriptTab = (): void => {
  if (!hasScript()) return;
  activeTab.set("script");
};

const isTemplateTab = (): boolean => activeTab.value === "template";

const isScriptTab = (): boolean => activeTab.value === "script";

const activeCode = (): string => {
  if (activeTab.value === "script" && hasScript()) return scriptCode();
  return templateCode();
};

const activeLanguage = (): string =>
  activeTab.value === "script" && hasScript() ? "Script" : "Template";

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const highlightTemplate = (value: string): string => {
  return escapeHtml(value)
    .replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="token tag">$2</span>')
    .replace(/(\$\{[^}]*\})/g, '<span class="token expr">$1</span>');
};

const highlightScript = (value: string): string => {
  return escapeHtml(value)
    .replace(/(&quot;[^&]*?&quot;|'[^']*?'|`[^`]*?`)/g, '<span class="token string">$1</span>')
    .replace(/(\/\/[^\n]*)/g, '<span class="token comment">$1</span>')
    .replace(
      /\b(const|let|return|if|else|true|false|null|undefined|import|from)\b/g,
      '<span class="token keyword">$1</span>'
    );
};

const highlightedCode = (): string =>
  activeTab.value === "script" && hasScript()
    ? highlightScript(activeCode())
    : highlightTemplate(activeCode());

const copyText = (): string => (copied.value ? "已复制" : "复制");

const onCopy = (): void => {
  const text = activeCode();
  navigator.clipboard?.writeText(text);
  copied.set(true);
  setTimeout(() => copied.set(false), 1500);
};

defineStyle(styles);

const Playground = defineHtml(html`
  <div class="wrap">
    <div class="header" v-if=${props.title}>${props.title}</div>
    <div class="demo"><slot></slot></div>
    <div class="source" v-if=${hasSource()}>
      <div class="source-toolbar">
        <div class="tabs" v-if=${showTabs()}>
          <button type="button" :class=${{ active: isTemplateTab() }} @click=${setTemplateTab}>
            Template
          </button>
          <button
            type="button"
            :class=${{ active: isScriptTab(), disabled: !hasScript() }}
            :disabled=${!hasScript()}
            @click=${setScriptTab}
          >
            Script
          </button>
        </div>
        <div class="source-actions">
          <span class="language">${activeLanguage()}</span>
          <button class="copy" type="button" @click=${onCopy}>${copyText()}</button>
        </div>
      </div>
      <pre><code v-html=${highlightedCode()}></code></pre>
    </div>
  </div>
`);

export { Playground };
