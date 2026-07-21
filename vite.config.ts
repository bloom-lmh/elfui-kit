import { defineConfig } from "vite";

import { loadElfuiWorkspace } from "./scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();

export default defineConfig(({ command }) => ({
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: command === "serve" ? "true" : "false"
  },
  server: { host: "127.0.0.1", port: 5174, open: true },
  build: { target: "es2022" },
  resolve: {
    alias: aliases,
    dedupe: ["@elfui/core", "@elfui/router"]
  }
}));
