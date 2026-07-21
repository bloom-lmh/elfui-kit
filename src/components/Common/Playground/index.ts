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
import { useLocaleProvider } from "../../Providers/context";
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
  script: { type: String, default: "" },
  controlsCollapsible: { type: Boolean, default: true },
  controlsCollapsed: { type: Boolean, default: false }
});

const emit = defineEmits<PlaygroundEmits>();

const copied = useRef(false);
const activeTab = useRef<"template" | "script">("template");
const hasControls = useRef(false);
const controlsCollapsed = useRef(Boolean(props.controlsCollapsed));
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
    // 首行从第 0 列开始时，后续缩进属于源码结构，不能再单独裁剪。
    if (globalMin === 0) return lines.join("\n");
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

const SCRIPT_KEYWORDS = new Set([
  "as", "async", "await", "class", "const", "default", "else", "export", "false",
  "from", "function", "if", "import", "let", "new", "null", "return", "true", "typeof",
  "undefined", "var"
]);

const SCRIPT_APIS = new Set([
  "css", "defineEmits", "defineExpose", "defineHtml", "defineModel", "defineProps", "html",
  "onMount", "onUnmount", "useComputed", "useEffect", "useReactive", "useRef", "watchEffect"
]);

const highlightScriptCode = (value: string): string => {
  const tokenPattern = /\b(?:[A-Za-z_$][\w$]*|\d+(?:\.\d+)?)\b/g;
  return escapeHtml(value).replace(tokenPattern, (token, offset, source: string) => {
    if (/^\d/.test(token)) return `<span class="token number">${token}</span>`;
    if (SCRIPT_KEYWORDS.has(token)) return `<span class="token keyword">${token}</span>`;
    if (SCRIPT_APIS.has(token)) return `<span class="token expr">${token}</span>`;
    if (/^\s*\(/.test(source.slice(offset + token.length))) {
      return `<span class="token function">${token}</span>`;
    }
    return token;
  });
};

const highlightScript = (value: string): string => {
  let output = "";
  let plainStart = 0;
  let index = 0;

  const flushCode = (end: number): void => {
    if (end > plainStart) output += highlightScriptCode(value.slice(plainStart, end));
  };

  while (index < value.length) {
    const quote = value[index];
    const next = value[index + 1];
    let tokenEnd = index;
    let tokenClass = "";

    if (quote === "/" && next === "/") {
      tokenEnd = value.indexOf("\n", index + 2);
      if (tokenEnd < 0) tokenEnd = value.length;
      tokenClass = "comment";
    } else if (quote === "/" && next === "*") {
      const closing = value.indexOf("*/", index + 2);
      tokenEnd = closing < 0 ? value.length : closing + 2;
      tokenClass = "comment";
    } else if (quote === '"' || quote === "'" || quote === "`") {
      tokenEnd = index + 1;
      while (tokenEnd < value.length) {
        if (value[tokenEnd] === "\\") {
          tokenEnd += 2;
          continue;
        }
        if (value[tokenEnd] === quote) {
          tokenEnd += 1;
          break;
        }
        tokenEnd += 1;
      }
      tokenClass = "string";
    }

    if (!tokenClass) {
      index += 1;
      continue;
    }

    flushCode(index);
    output += `<span class="token ${tokenClass}">${escapeHtml(value.slice(index, tokenEnd))}</span>`;
    index = tokenEnd;
    plainStart = index;
  }

  flushCode(value.length);
  return output;
};

const highlightedCode = (): string =>
  activeTab.value === "script" && hasScript()
    ? highlightScript(activeCode())
    : highlightTemplate(activeCode());

const locale = useLocaleProvider();
const copyText = (): string =>
  locale.t(copied.value ? "playground.copied" : "playground.copy");

const controlsLabel = (): string => locale.t("playground.controls");

const toggleControlsLabel = (): string => locale.t(
  controlsCollapsed.value ? "playground.expandControls" : "playground.collapseControls"
);

const toggleControls = (): void => {
  if (!hasControls.value || !props.controlsCollapsible) return;
  controlsCollapsed.set(!controlsCollapsed.value);
  emit("controlsToggle", controlsCollapsed.value);
};

const syncStatusSlots = (): void => {
  const states = host.querySelectorAll<HTMLElement>('.demo-state, [slot="status"]');
  states.forEach((state) => {
    state.slot = "status";
    if (state.parentElement !== host) host.appendChild(state);
  });

  const controls = host.querySelectorAll<HTMLElement>('.demo-controls, [slot="controls"]');
  controls.forEach((control) => {
    control.slot = "controls";
    if (control.parentElement !== host) host.appendChild(control);
  });
  hasControls.set(controls.length > 0);
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

defineExpose({ showTemplate: setTemplateTab, showScript: setScriptTab, copy, toggleControls });
defineStyle(styles);

const Playground = defineHtml<PlaygroundProps, PlaygroundEmits, PlaygroundSlots>(html`
  <div class="wrap">
    <div class="header" v-if=${props.title}>
      <span class="title">${props.title}</span>
      <span class="header-end">
        <slot name="status"></slot>
        <button
          v-if=${hasControls.value && props.controlsCollapsible}
              :class=${["controls-toggle", { "is-collapsed": controlsCollapsed.value }]}
          type="button"
          :aria-label=${toggleControlsLabel()}
          :title=${toggleControlsLabel()}
          :aria-expanded=${String(!controlsCollapsed.value)}
          @click=${toggleControls}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 9.5 12 13.5 16 9.5" />
          </svg>
        </button>
      </span>
    </div>
    <div :class=${{ workspace: true, "has-controls": hasControls.value, "controls-collapsed": controlsCollapsed.value }}>
      <div class="demo"><slot></slot></div>
      <aside v-if=${hasControls.value} v-show=${!controlsCollapsed.value} class="controls" :aria-label=${controlsLabel()}>
        <slot name="controls"></slot>
      </aside>
    </div>
    <div class="source" v-if=${hasSource()}>
      <div class="source-toolbar">
        <div class="tabs" role="tablist" :aria-label=${locale.t("playground.source")} v-if=${showTabs()}>
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
