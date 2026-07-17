import type { ThemeTokens } from "../components/Providers/context";

export interface AppSkin {
  id: string;
  label: string;
  providerTheme: "light" | "dark" | "custom";
  dark: boolean;
  tokens: ThemeTokens;
}

export const APP_SKINS: AppSkin[] = [
  { id: "material", label: "Material", providerTheme: "light", dark: false, tokens: {} },
  { id: "midnight", label: "Midnight", providerTheme: "dark", dark: true, tokens: {} },
  {
    id: "forest",
    label: "Forest",
    providerTheme: "custom",
    dark: false,
    tokens: {
      primary: "#2f6b4f", primaryHover: "#25573f", primaryActive: "#1c4532",
      secondary: "#9a6b22", success: "#2e7d32", warning: "#b26a00", danger: "#ba1a1a", info: "#356a87",
      textPrimary: "#17211b", textSecondary: "#526057", textDisabled: "#8a948d", textOnPrimary: "#ffffff",
      bgDefault: "#f5faf5", bgPaper: "#ffffff", bgOverlay: "rgba(47, 107, 79, 0.07)",
      fieldBg: "#e8f0e9", fieldHoverBg: "#dde9df", border: "#c6d3c9", borderStrong: "#8fa096", divider: "#dce5de"
    }
  },
  {
    id: "sunset",
    label: "Sunset",
    providerTheme: "custom",
    dark: false,
    tokens: {
      primary: "#9c4234", primaryHover: "#823429", primaryActive: "#69281f",
      secondary: "#6f4d8f", success: "#3c7a57", warning: "#a76000", danger: "#ba1a1a", info: "#3f6685",
      textPrimary: "#2b1916", textSecondary: "#705b56", textDisabled: "#a18e89", textOnPrimary: "#ffffff",
      bgDefault: "#fff8f5", bgPaper: "#fffdfb", bgOverlay: "rgba(156, 66, 52, 0.07)",
      fieldBg: "#f6e9e4", fieldHoverBg: "#efded8", border: "#dec5bd", borderStrong: "#ad8d84", divider: "#ead8d2"
    }
  }
];
