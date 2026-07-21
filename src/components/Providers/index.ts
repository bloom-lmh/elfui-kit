// Providers
import { registerComponents } from "@elfui/core";

import { DefaultsProvider } from "./DefaultsProvider/index";
import { LocaleProvider } from "./LocaleProvider/index";
import { ThemeProvider } from "./ThemeProvider/index";

export * from "./context";

registerComponents(DefaultsProvider, LocaleProvider, ThemeProvider);
