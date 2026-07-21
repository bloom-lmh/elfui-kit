import { defineConfig } from "vitest/config";

import { loadElfuiWorkspace } from "./scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();

export default defineConfig({
    plugins: [elfuiMacroPlugin()],
    resolve: {
        alias: aliases,
        dedupe: ["@elfui/core", "@elfui/router"],
    },
    test: {
        environment: "happy-dom",
        define: {
            __DEV__: "true",
        },
    },
});
