// elf-locale-provider — 为子树提供本地化文案与方向

import { defineProps, defineStyle, html, provide, useEffect, useHost, defineHtml } from "@elfui/core";

import {
    LOCALE_PROVIDER_KEY,
    createTranslator,
    mergeMessages,
    type LocaleDirection,
    type LocaleMessages,
    type LocaleProviderContext,
    localeMessagesFor,
} from "../context";
import styles from "./style.scss?inline";

export type { LocaleDirection, LocaleMessages, LocaleProviderProps } from "./types";

const props = defineProps({
    name: { type: String, default: "zh-CN" },
    dir: { type: String, default: "ltr" },
    rtl: { type: Boolean, default: false },
    messages: { type: Object, default: () => ({}) },
});

const host = useHost();

const readMessages = (): LocaleMessages =>
    mergeMessages(localeMessagesFor(String(props.name || "zh-CN")), (props.messages || {}) as LocaleMessages);

const readDir = (): LocaleDirection => {
    if (props.rtl) return "rtl";
    return props.dir === "rtl" ? "rtl" : "ltr";
};

const context: LocaleProviderContext = {
    get name() {
        return String(props.name || "zh-CN");
    },
    get dir() {
        return readDir();
    },
    get messages() {
        return readMessages();
    },
    t(path, params) {
        return createTranslator(readMessages())(path, params);
    },
};

provide(LOCALE_PROVIDER_KEY, context);

useEffect(() => {
    host.setAttribute("lang", context.name);
    host.setAttribute("dir", context.dir);
    host.setAttribute("data-locale", context.name);
});

defineStyle(styles);

const LocaleProvider = defineHtml(html`<slot></slot>`);

export { LocaleProvider };
