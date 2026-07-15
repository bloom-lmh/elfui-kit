import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { IconProps, IconSlots } from "./types";

export type { IconProps, IconSlots } from "./types";

const props = defineProps<IconProps>({
    name: { type: String, default: "" },
    size: { type: [Number, String], default: "1em" },
    color: { type: String, default: "" },
    ariaLabel: { type: String, default: "" },
    loading: { type: Boolean, default: false },
});

const size = (): string => {
    const value = props.size;
    if (typeof value === "number") return `${Math.max(1, value)}px`;
    const s = String(value || "");
    // 纯数字字符串如 "16" → "16px"
    if (/^\d+$/.test(s)) return `${s}px`;
    return s || "1em";
};

useHostCssVar("--_icon-size", size);
useHostCssVar("--_icon-color", () => props.color || "currentColor");

defineStyle(styles);

const Icon = defineHtml<IconProps, Record<string, never>, IconSlots>(html`
    <span
        :class=${{ icon: true, "is-loading": props.loading }}
        part="icon"
        :aria-hidden=${props.ariaLabel ? "false" : "true"}
        :aria-label=${props.ariaLabel || null}
        :role=${props.ariaLabel ? "img" : null}
    >
        <slot>${props.name}</slot>
    </span>
`);

export { Icon };
