import { defineHtml, defineStyle, html } from "elfui";
import { onMount, onUnmount, useEffect, useRef } from "elfui";
import { getActiveRouter } from "@elfui/router";
import { navItems } from "../../routes";
import styles from "./style.scss?inline";

defineStyle(styles);

const THEME_KEY = "elfui-ui-theme";

const ICONS: Record<string, string> = {
    首页: "⌂",
    "Layout 布局": "L",
    "Basic 基础": "B",
    "Form 表单": "F",
    "Feedback 反馈": "M",
    "Data 数据展示": "D",
    "Navigation 导航": "N",
    "Picker 选择器": "P",
    "Providers 提供者": "C",
};

interface AppMenuItem {
    index: string;
    label: string;
    icon: string;
    children?: AppMenuItem[];
}

const readCurrentPath = (): string => {
    const router = getActiveRouter();
    if (router) return router.current.peek().path;
    if (typeof window === "undefined") return "/";
    const hash = window.location.hash || "#/";
    return hash.startsWith("#") ? hash.slice(1) || "/" : hash || "/";
};

const initial = (typeof localStorage !== "undefined" && localStorage.getItem(THEME_KEY)) || "light";

const theme = useRef(initial);

const collapsed = useRef(false);

const active = useRef(readCurrentPath());

let removeHashListener = (): void => {};

if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", initial);

const toggleTheme = () => {
    const next = theme.value === "light" ? "dark" : "light";
    theme.set(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch {
        /* */
    }
};

const toggleCollapsed = () => collapsed.set(!collapsed.value);

useEffect(() => {
    const router = getActiveRouter();
    if (!router) return;
    active.set(router.current.value.path);
});

onMount(() => {
    active.set(readCurrentPath());
    if (typeof window === "undefined") return;
    const syncFromHash = () => active.set(readCurrentPath());
    window.addEventListener("hashchange", syncFromHash);
    removeHashListener = () => window.removeEventListener("hashchange", syncFromHash);
});

onUnmount(() => removeHashListener());

const onSelect = (e: Event) => {
    const next = String((e as CustomEvent).detail ?? "/");
    active.set(next);
    const router = getActiveRouter();
    if (router) {
        void router.push(next);
    } else if (typeof window !== "undefined" && next.startsWith("/")) {
        window.location.hash = next;
    }
};

const onChange = (e: Event) => collapsed.set(Boolean((e as CustomEvent).detail));

const groups: Record<string, AppMenuItem[]> = {};

const top: AppMenuItem[] = [];

for (const { to, text, group } of navItems) {
    const item = {
        index: to,
        label: text,
        icon: ICONS[text] || "",
    };
    if (group) {
        (groups[group] ??= []).push(item);
    } else {
        top.push(item);
    }
}

const menuItems = [...top];

const openKeys: string[] = [];

for (const [group, children] of Object.entries(groups)) {
    const key = `group:${group}`;
    menuItems.push({
        index: key,
        label: group,
        icon: ICONS[group] || "",
        children,
    });
    openKeys.push(key);
}

const App = defineHtml(html`
    <elf-layout>
        <elf-header height="56px">
            <span class="brand">
                <img class="brand-logo" src="/logo.png" alt="ElfUI logo" />
                <span>ElfUI</span>
            </span>
            <span class="spacer"></span>
            <elf-button variant="text" size="sm" @click=${toggleCollapsed}> {{ collapsed ? '☰' : '✕' }} </elf-button>
            <elf-button variant="text" size="sm" @click=${toggleTheme}>
                {{ theme === 'light' ? '🌙' : '☀️' }}
            </elf-button>
        </elf-header>

        <elf-layout direction="horizontal">
            <elf-aside class="app-aside" :width="collapsed ? '68px' : '264px'">
                <elf-menu
                    class="app-menu"
                    searchable
                    unique-opened
                    :items="menuItems"
                    :modelValue="active"
                    :collapse="collapsed"
                    @update:modelValue="onSelect"
                    @collapse-change="onChange"
                >
                </elf-menu>
            </elf-aside>

            <elf-main>
                <elf-router-view></elf-router-view>
            </elf-main>
        </elf-layout>

        <elf-footer height="40px"> © 2026 ElfUI · gzip ~14 KB </elf-footer>
    </elf-layout>
`);

export { App };
