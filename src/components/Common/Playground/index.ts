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

import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useHost,
  useRef
} from "elfui";

import styles from "./style.scss?inline";
import type { PlaygroundEmits, PlaygroundProps, PlaygroundSlots } from "./types";

export type {
  PlaygroundElement,
  PlaygroundEmits,
  PlaygroundExpose,
  PlaygroundProps,
  PlaygroundSlots
} from "./types";

const props = defineProps<PlaygroundProps>({
  title: { type: String, default: "" },
  code: { type: String, default: "" },
  script: { type: String, default: "" }
});

const emit = defineEmits<PlaygroundEmits>();

const copied = useRef(false);
const activeTab = useRef<"template" | "script">("template");
const host = useHost();
let statusObserver: MutationObserver | undefined;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const normalizeCode = (value: string): string => {
    const text = String(value || "").replace(/\r\n/g, "\n");
    const lines = text.split("\n");
    while (lines.length > 0 && !lines[0]!.trim()) lines.shift();
    while (lines.length > 0 && !lines[lines.length - 1]!.trim()) lines.pop();
    if (lines.length === 0) return "";
    const contentIndents = lines
        .filter((l) => l.trim())
        .map((l) => l.match(/^\s*/)?.[0].length ?? 0);
    const globalMin = Math.min(...contentIndents);
    if (globalMin === 0) {
        // 有些行 0 缩进（紧跟反引号），只对有缩进的行 trim
        const targets = contentIndents.filter((n) => n > 0);
        if (targets.length === 0) return lines.join("\n");
        const trimBy = Math.min(...targets);
        return lines.map((line) => {
            const indent = line.match(/^\s*/)?.[0].length ?? 0;
            return indent >= trimBy ? line.slice(trimBy) : line;
        }).join("\n");
    }
    return lines.map((line) => (line ? line.slice(globalMin) : line)).join("\n");
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
    let html = escapeHtml(value);
    // HTML 注释
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token comment">$1</span>');
    // 标签名
    html = html.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="token tag">$2</span>');
    // 属性名=属性值
    html = html.replace(
        / ([\w-]+)(=)(&quot;[^&]*?&quot;)/g,
        ' <span class="token attr">$1</span>$2<span class="token string">$3</span>'
    );
    // 布尔属性（无 = 号的独立单词，在标签内）
    html = html.replace(
        / ([\w-]+)(?=[\s&]|$)(?![^<]*&quot;)(?![^<]*<)/g,
        ' <span class="token attr">$1</span>'
    );
    // ${...} 表达式
    html = html.replace(/(\$\{[^}]*\})/g, '<span class="token expr">$1</span>');
    // {{ ... }} 插值
    html = html.replace(/(\{\{[^}]*\}\})/g, '<span class="token expr">$1</span>');
    return html;
};

const highlightScript = (value: string): string => {
    let html = escapeHtml(value);
    // 字符串
    html = html.replace(
        /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|'[^']*?'|`[^`]*?`)/g,
        '<span class="token string">$1</span>'
    );
    // 注释
    html = html.replace(/(\/\/[^\n]*)/g, '<span class="token comment">$1</span>');
    // 关键字
    html = html.replace(
        /\b(const|let|var|return|if|else|true|false|null|undefined|import|from|export|default|as|typeof|new|class|function|async|await)\b/g,
        '<span class="token keyword">$1</span>'
    );
    // 数字
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token number">$1</span>');
    // 函数调用
    html = html.replace(/\b(\w+)(?=\()/g, '<span class="token function">$1</span>');
    // ElfUI API
    html = html.replace(
        /\b(useRef|useReactive|useComputed|defineHtml|defineProps|defineEmits|defineModel|defineExpose|html|css|onMount|onUnmount|useEffect|watchEffect)\b/g,
        '<span class="token expr">$1</span>'
    );
    return html;
};

const highlightedCode = (): string =>
  activeTab.value === "script" && hasScript()
    ? highlightScript(activeCode())
    : highlightTemplate(activeCode());

const copyText = (): string => (copied.value ? "已复制" : "复制");

const syncStatusSlots = (): void => {
  const states = host.querySelectorAll<HTMLElement>('.demo-state, [slot="status"]');
  states.forEach((state) => {
    state.slot = "status";
    if (state.parentElement !== host) host.appendChild(state);
  });
};

const writeClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const succeeded = document.execCommand?.("copy") ?? false;
  input.remove();
  if (!succeeded) throw new Error("Clipboard API is unavailable");
};

const copy = async (): Promise<boolean> => {
  const text = activeCode();
  if (!text) return false;

  try {
    await writeClipboard(text);
    copied.set(true);
    emit("copy", text);
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => copied.set(false), 1500);
    return true;
  } catch (error) {
    copied.set(false);
    emit("copyError", error);
    return false;
  }
};

const onCopy = (): void => {
  void copy();
};

onMount(() => {
  syncStatusSlots();
  statusObserver = new MutationObserver(syncStatusSlots);
  statusObserver.observe(host, { childList: true, subtree: true });
});

onUnmount(() => {
  statusObserver?.disconnect();
  statusObserver = undefined;
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = undefined;
});

defineExpose({ showTemplate: setTemplateTab, showScript: setScriptTab, copy });
defineStyle(styles);

const Playground = defineHtml<PlaygroundProps, PlaygroundEmits, PlaygroundSlots>(html`
  <div class="wrap">
    <div class="header" v-if=${props.title}>
      <span class="title">${props.title}</span>
      <slot name="status"></slot>
    </div>
    <div class="demo"><slot></slot></div>
    <div class="source" v-if=${hasSource()}>
      <div class="source-toolbar">
        <div class="tabs" role="tablist" aria-label="示例源码" v-if=${showTabs()}>
          <button
            type="button"
            role="tab"
            :aria-selected=${String(isTemplateTab())}
            :class=${{ active: isTemplateTab() }}
            @click=${setTemplateTab}
          >
            Template
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected=${String(isScriptTab())}
            :class=${{ active: isScriptTab(), disabled: !hasScript() }}
            :disabled=${!hasScript()}
            @click=${setScriptTab}
          >
            Script
          </button>
        </div>
        <div class="source-actions">
          <span class="language">${activeLanguage()}</span>
          <button class="copy" type="button" aria-live="polite" @click=${onCopy}>${copyText()}</button>
        </div>
      </div>
      <pre role="tabpanel" :aria-label=${activeLanguage()}><code v-html=${highlightedCode()}></code></pre>
    </div>
  </div>
`);

export { Playground };
