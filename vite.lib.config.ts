import { defineConfig } from "vite";

import { elfuiMacroPlugin } from "@elfui/vite-plugin";

export default defineConfig({
  publicDir: false,
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: "false"
  },
  resolve: {
    alias: {
      elfui: "@elfui/core"
    },
    dedupe: ["elfui", "@elfui/core"]
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
      external: (id) => id === "elfui" || id.startsWith("@elfui/")
    }
  }
});
