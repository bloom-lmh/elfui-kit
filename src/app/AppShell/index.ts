import { getActiveRouter } from "@elfui/router";
import {
  defineHtml,
  defineStyle,
  html,
  onMount,
  onUnmount,
  useComputed,
  useEffect,
  useRef
} from "elfui";

import type { LocaleMessages } from "../../components/Providers/context";
import { navItems } from "../../routes";
import { APP_SKINS, type AppSkin } from "../skins";
import styles from "./style.scss?inline";

const SKIN_KEY = "elfui-ui-skin";
const LEGACY_THEME_KEY = "elfui-ui-theme";
const LOCALE_KEY = "elfui-ui-locale";

interface AppMenuItem {
  index: string;
  label: string;
  icon: string;
  children?: AppMenuItem[];
}

const ICONS: Record<string, string> = {
  首页: "⌂",
  "Layout 布局": "L",
  "Basic 基础": "B",
  "Form 表单": "F",
  "Feedback 反馈": "M",
  "Data 数据展示": "D",
  "Navigation 导航": "N",
  "Picker 选择器": "P",
  "Providers 提供者": "C",
  "Utilities 工具类": "U"
};

const APP_MESSAGES: Record<string, LocaleMessages> = {
  "zh-CN": { app: { search: "搜索组件…", collapse: "切换侧栏", language: "切换为英文", skin: "切换主题皮肤", footer: "组件库与设计系统" } },
  "en-US": { app: { search: "Search components…", collapse: "Toggle sidebar", language: "Switch to Chinese", skin: "Switch theme skin", footer: "Component library and design system" } }
};

const readStorage = (key: string, fallback: string): string => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};

const readCurrentPath = (): string => {
  const router = getActiveRouter();
  if (router) return router.current.peek().path;
  if (typeof window === "undefined") return "/";
  const hash = window.location.hash || "#/";
  return hash.startsWith("#") ? hash.slice(1) || "/" : hash || "/";
};

const normalizeSkin = (value: string): string => {
  if (APP_SKINS.some((skin) => skin.id === value)) return value;
  return value === "dark" ? "midnight" : "material";
};

const englishLabel = (label: string): string => {
  if (label === "首页") return "Home";
  const stripped = label.replace(/[\u3400-\u9fff\u3000-\u303f]+/g, "").replace(/\s+/g, " ").trim();
  return stripped || label;
};

// State
const initialSkin = normalizeSkin(readStorage(SKIN_KEY, readStorage(LEGACY_THEME_KEY, "material")));
const skinName = useRef(initialSkin);
const localeName = useRef(readStorage(LOCALE_KEY, "zh-CN") === "en-US" ? "en-US" : "zh-CN");
const collapsed = useRef(false);
const active = useRef(readCurrentPath());
let removeHashListener = (): void => {};

// Derived state
const currentSkin = (): AppSkin => APP_SKINS.find((skin) => skin.id === skinName.value) || APP_SKINS[0]!;
const isEnglish = (): boolean => localeName.value === "en-US";
const currentMessages = (): LocaleMessages => APP_MESSAGES[localeName.value] || APP_MESSAGES["zh-CN"]!;
const text = (zh: string, en: string): string => isEnglish() ? en : zh;
const localizeLabel = (label: string): string => isEnglish() ? englishLabel(label) : label;
const collapseIcon = (): string => collapsed.value ? "☰" : "✕";
const languageLabel = (): string => isEnglish() ? "中" : "EN";
const skinLabel = (): string => `● ${currentSkin().label}`;
const appMessage = (key: string): string => String((currentMessages().app as Record<string, string>)[key] || key);

const menuItems = useComputed((): AppMenuItem[] => {
  const groups: Record<string, AppMenuItem[]> = {};
  const top: AppMenuItem[] = [];
  for (const { to, text: label, group } of navItems) {
    const item = { index: to, label: localizeLabel(label), icon: ICONS[label] || "" };
    if (group) (groups[group] ??= []).push(item);
    else top.push(item);
  }
  for (const [group, children] of Object.entries(groups)) {
    top.push({ index: `group:${group}`, label: localizeLabel(group), icon: ICONS[group] || "", children });
  }
  return top;
});

// Methods
const applyDocumentSkin = (): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", currentSkin().dark ? "dark" : "light");
  document.documentElement.setAttribute("data-skin", currentSkin().id);
  document.documentElement.lang = localeName.value;
};

const cycleSkin = (): void => {
  const index = APP_SKINS.findIndex((skin) => skin.id === skinName.value);
  skinName.set(APP_SKINS[(index + 1) % APP_SKINS.length]!.id);
  applyDocumentSkin();
  try { localStorage.setItem(SKIN_KEY, skinName.value); } catch { /* storage unavailable */ }
};

const toggleLocale = (): void => {
  localeName.set(isEnglish() ? "zh-CN" : "en-US");
  applyDocumentSkin();
  try { localStorage.setItem(LOCALE_KEY, localeName.value); } catch { /* storage unavailable */ }
};

const toggleCollapsed = (): void => collapsed.set(!collapsed.value);

const onSelect = (event: Event): void => {
  const next = String((event as CustomEvent).detail ?? "/");
  active.set(next);
  const router = getActiveRouter();
  if (router) void router.push(next);
  else if (typeof window !== "undefined" && next.startsWith("/")) window.location.hash = next;
};

const onCollapseChange = (event: Event): void => collapsed.set(Boolean((event as CustomEvent).detail));

// Effects and lifecycle
useEffect(() => {
  const router = getActiveRouter();
  if (router) active.set(router.current.value.path);
});

onMount(() => {
  applyDocumentSkin();
  active.set(readCurrentPath());
  if (typeof window === "undefined") return;
  const syncFromHash = () => active.set(readCurrentPath());
  window.addEventListener("hashchange", syncFromHash);
  removeHashListener = () => window.removeEventListener("hashchange", syncFromHash);
});

onUnmount(() => removeHashListener());

defineStyle(styles);

const App = defineHtml(html`
  <elf-locale-provider :name=${localeName.value} :messages.prop=${currentMessages()}>
    <elf-theme-provider :theme=${currentSkin().providerTheme} :tokens.prop=${currentSkin().tokens}>
      <elf-layout>
        <elf-header height="64px">
          <span class="brand">
            <img class="brand-logo" src="/logo.png" alt="ElfUI logo" />
            <span>ElfUI</span>
          </span>
          <span class="spacer"></span>
          <elf-button class="header-action" variant="text" size="sm" :title=${appMessage("language")} @click=${toggleLocale}>${languageLabel()}</elf-button>
          <elf-button class="header-action skin-action" variant="text" size="sm" :title=${appMessage("skin")} @click=${cycleSkin}>${skinLabel()}</elf-button>
          <elf-button class="header-action icon-action" variant="text" size="sm" :title=${appMessage("collapse")} @click=${toggleCollapsed}>${collapseIcon()}</elf-button>
        </elf-header>

        <elf-layout direction="horizontal">
          <elf-aside class="app-aside" :width=${collapsed.value ? "68px" : "264px"}>
            <elf-menu
              v-if=${isEnglish()}
              key="en-menu"
              class="app-menu"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              @update:modelValue=${onSelect}
              @collapse-change=${onCollapseChange}
            ></elf-menu>
            <elf-menu
              v-else
              key="zh-menu"
              class="app-menu"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              @update:modelValue=${onSelect}
              @collapse-change=${onCollapseChange}
            ></elf-menu>
          </elf-aside>

          <elf-main><elf-router-view></elf-router-view></elf-main>
        </elf-layout>

        <elf-footer height="40px">© 2026 ElfUI · ${appMessage("footer")}</elf-footer>
      </elf-layout>
    </elf-theme-provider>
  </elf-locale-provider>
`);

export { App };
