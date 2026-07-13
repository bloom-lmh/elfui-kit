// elf-theme-provider — 通过 CSS variables 为一段子树提供局部主题

import { defineProps, defineStyle, html, provide, useEffect, useHost, defineHtml } from "elfui";

import { THEME_PROVIDER_KEY, type ThemeProviderContext, type ThemeTokens } from "../context";
import styles from "./style.scss?inline";

export type { ThemeProviderProps, ThemeProviderTheme, ThemeTokens } from "./types";

const TOKEN_VARS: Record<keyof ThemeTokens, string> = {
    primary: "--elf-primary",
    primaryHover: "--elf-primary-hover",
    primaryActive: "--elf-primary-active",
    secondary: "--elf-secondary",
    success: "--elf-success",
    warning: "--elf-warning",
    danger: "--elf-danger",
    info: "--elf-info",
    textPrimary: "--elf-text-primary",
    textSecondary: "--elf-text-secondary",
    textDisabled: "--elf-text-disabled",
    textOnPrimary: "--elf-text-on-primary",
    bgDefault: "--elf-bg-default",
    bgPaper: "--elf-bg-paper",
    bgOverlay: "--elf-bg-overlay",
    border: "--elf-border",
    borderStrong: "--elf-border-strong",
    divider: "--elf-divider",
};

const LIGHT_TOKENS: ThemeTokens = {
    primary: "#1976d2",
    primaryHover: "#1565c0",
    primaryActive: "#0d47a1",
    secondary: "#d81b60",
    success: "#2e7d32",
    warning: "#ed6c02",
    danger: "#d32f2f",
    info: "#0288d1",
    textPrimary: "rgba(0, 0, 0, 0.87)",
    textSecondary: "rgba(0, 0, 0, 0.6)",
    textDisabled: "rgba(0, 0, 0, 0.38)",
    textOnPrimary: "#ffffff",
    bgDefault: "#ffffff",
    bgPaper: "#ffffff",
    bgOverlay: "rgba(0, 0, 0, 0.04)",
    border: "rgba(0, 0, 0, 0.12)",
    borderStrong: "rgba(0, 0, 0, 0.23)",
    divider: "rgba(0, 0, 0, 0.08)",
};

const DARK_TOKENS: ThemeTokens = {
    primary: "#90caf9",
    primaryHover: "#64b5f6",
    primaryActive: "#42a5f5",
    secondary: "#f48fb1",
    success: "#66bb6a",
    warning: "#ffa726",
    danger: "#ef5350",
    info: "#4fc3f7",
    textPrimary: "rgba(255, 255, 255, 0.87)",
    textSecondary: "rgba(255, 255, 255, 0.6)",
    textDisabled: "rgba(255, 255, 255, 0.38)",
    textOnPrimary: "rgba(0, 0, 0, 0.87)",
    bgDefault: "#121212",
    bgPaper: "#1e1e1e",
    bgOverlay: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.12)",
    borderStrong: "rgba(255, 255, 255, 0.23)",
    divider: "rgba(255, 255, 255, 0.08)",
};

const props = defineProps({
    theme: { type: String, default: "light" },
    primary: { type: String, default: "" },
    secondary: { type: String, default: "" },
    success: { type: String, default: "" },
    warning: { type: String, default: "" },
    danger: { type: String, default: "" },
    info: { type: String, default: "" },
    background: { type: String, default: "" },
    surface: { type: String, default: "" },
    textColor: { type: String, default: "" },
    tokens: { type: Object, default: () => ({}) },
});

const host = useHost();

const isDark = (): boolean => String(props.theme || "").toLowerCase() === "dark";

const readTokens = (): ThemeTokens => {
    const themeName = String(props.theme || "light").toLowerCase();
    const base = themeName === "dark" ? DARK_TOKENS : themeName === "light" ? LIGHT_TOKENS : {};
    return {
        ...base,
        ...((props.tokens || {}) as ThemeTokens),
        ...(props.primary ? { primary: String(props.primary) } : {}),
        ...(props.secondary ? { secondary: String(props.secondary) } : {}),
        ...(props.success ? { success: String(props.success) } : {}),
        ...(props.warning ? { warning: String(props.warning) } : {}),
        ...(props.danger ? { danger: String(props.danger) } : {}),
        ...(props.info ? { info: String(props.info) } : {}),
        ...(props.background ? { bgDefault: String(props.background) } : {}),
        ...(props.surface ? { bgPaper: String(props.surface) } : {}),
        ...(props.textColor ? { textPrimary: String(props.textColor) } : {}),
    };
};

const context: ThemeProviderContext = {
    get theme() {
        return String(props.theme || "light");
    },
    get isDark() {
        return isDark();
    },
    get tokens() {
        return readTokens();
    },
};

provide(THEME_PROVIDER_KEY, context);

useEffect(() => {
    const tokens = readTokens();
    for (const varName of Object.values(TOKEN_VARS)) {
        host.style.removeProperty(varName);
    }
    for (const [key, value] of Object.entries(tokens) as Array<[keyof ThemeTokens, string]>) {
        const varName = TOKEN_VARS[key];
        if (varName && value) host.style.setProperty(varName, value);
    }
    host.setAttribute("data-theme", context.theme);
});

defineStyle(styles);

const ThemeProvider = defineHtml(html`<slot></slot>`);

export { ThemeProvider };
