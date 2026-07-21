import { defineConfig } from "vite";

import { loadElfuiWorkspace } from "./scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();

export default defineConfig({
  publicDir: false,
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: "false"
  },
  resolve: {
    alias: aliases,
    dedupe: ["@elfui/core"]
  },
  build: {
    target: "es2022",
    outDir: "lib-dist",
    sourcemap: true,
    lib: {
      entry: "src/library.ts",
      formats: ["es"],
      fileName: "elfui-kit",
      cssFileName: "utilities"
    },
    rollupOptions: {
      external: (id) => id.startsWith("@elfui/")
    }
  }
});
