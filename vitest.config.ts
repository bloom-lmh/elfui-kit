import { defineConfig } from "vitest/config";

import { elfuiMacroPlugin } from "@elfui/vite-plugin";

export default defineConfig({
    plugins: [elfuiMacroPlugin()],
    resolve: {
        alias: {
            elfui: "@elfui/core",
        },
        dedupe: ["elfui", "@elfui/core", "@elfui/router"],
    },
    test: {
        environment: "happy-dom",
        define: {
            __DEV__: "true",
        },
    },
});
