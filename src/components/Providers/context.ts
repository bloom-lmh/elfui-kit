import { createInjectionKey, inject } from "elfui";

export type ProviderDefaults = Record<string, Record<string, unknown>>;
export type DefaultsStrategy = "missing" | "overwrite";

export interface DefaultsProviderContext {
  readonly defaults: ProviderDefaults;
  readonly disabled: boolean;
  readonly strategy: DefaultsStrategy;
  applyDefaults(root?: ParentNode): void;
}

export type LocaleDirection = "ltr" | "rtl";
export type LocaleMessages = Record<string, unknown>;

export interface LocaleProviderContext {
  readonly name: string;
  readonly dir: LocaleDirection;
  readonly messages: LocaleMessages;
  t(path: string, params?: Record<string, string | number>): string;
}

export type ThemeTokens = Partial<{
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
  bgDefault: string;
  bgPaper: string;
  bgOverlay: string;
  border: string;
  borderStrong: string;
  divider: string;
}>;

export interface ThemeProviderContext {
  readonly theme: string;
  readonly isDark: boolean;
  readonly tokens: ThemeTokens;
}

export const DEFAULTS_PROVIDER_KEY =
  createInjectionKey<DefaultsProviderContext>("elfui.defaults-provider");
export const LOCALE_PROVIDER_KEY =
  createInjectionKey<LocaleProviderContext>("elfui.locale-provider");
export const THEME_PROVIDER_KEY = createInjectionKey<ThemeProviderContext>("elfui.theme-provider");

export const DEFAULT_LOCALE_MESSAGES: LocaleMessages = {
  common: {
    confirm: "确认",
    cancel: "取消",
    clear: "清空",
    close: "关闭",
    submit: "提交"
  },
  table: {
    empty: "暂无数据",
    loading: "加载中"
  }
};

const readPath = (messages: LocaleMessages, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, messages);
};

export const createTranslator =
  (messages: LocaleMessages) =>
  (path: string, params: Record<string, string | number> = {}): string => {
    const matched = readPath(messages, path);
    if (typeof matched !== "string") return path;
    return matched.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ""));
  };

export const mergeMessages = (
  base: LocaleMessages,
  overrides: LocaleMessages = {}
): LocaleMessages => {
  const output: LocaleMessages = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    const baseValue = output[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      output[key] = mergeMessages(baseValue as LocaleMessages, value as LocaleMessages);
    } else {
      output[key] = value;
    }
  }
  return output;
};

export const DEFAULT_LOCALE_CONTEXT: LocaleProviderContext = {
  name: "zh-CN",
  dir: "ltr",
  messages: DEFAULT_LOCALE_MESSAGES,
  t: createTranslator(DEFAULT_LOCALE_MESSAGES)
};

export const useDefaultsProvider = (): DefaultsProviderContext | undefined =>
  inject(DEFAULTS_PROVIDER_KEY);

export const useLocaleProvider = (): LocaleProviderContext =>
  inject(LOCALE_PROVIDER_KEY, DEFAULT_LOCALE_CONTEXT) ?? DEFAULT_LOCALE_CONTEXT;

export const useThemeProvider = (): ThemeProviderContext | undefined => inject(THEME_PROVIDER_KEY);
