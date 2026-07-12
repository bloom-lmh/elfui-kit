import { defineConfig } from "vite";

import { elfuiMacroPlugin } from "@elfui/vite-plugin";

export default defineConfig(({ command }) => ({
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: command === "serve" ? "true" : "false"
  },
  server: { host: "127.0.0.1", port: 5174, open: true },
  build: { target: "es2022" },
  resolve: {
    alias: {
      elfui: "@elfui/core"
    },
    dedupe: ["elfui", "@elfui/core", "@elfui/router"]
  }
}));
