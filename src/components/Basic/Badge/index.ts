import { defineHtml, defineProps, defineStyle, html, useRef } from "elfui";

import styles from "./style.scss?inline";
import type { BadgeProps } from "./types";

export type { BadgeProps, BadgeType } from "./types";

const props = defineProps<BadgeProps>({
    value: { type: String, default: "" },
    max: { type: Number, default: 99 },
    isDot: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    type: { type: String, default: "danger" },
    showZero: { type: Boolean, default: true },
    color: { type: String, default: "" },
    offset: { type: [Array, String], default: "" },
    badgeStyle: { type: [Object, String], default: "" },
    badgeClass: { type: String, default: "" },
    content: { type: [String, Number], default: "" },
});

const toBadgeValue = (value: unknown): string | number => {
    if (typeof value === "number" || typeof value === "string") return value;
    if (value == null) return "";
    return String(value);
};

const formatValue = (): string | number => {
    const content = toBadgeValue(props.content);
    const value = content === "" ? toBadgeValue(props.value) : content;
    if (value === "") return "";

    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
        return numericValue > Number(props.max) ? `${props.max}+` : numericValue;
    }

    return value;
};

const offset = (): [number, number] => {
    const raw = props.offset;
    if (Array.isArray(raw)) return [Number(raw[0] || 0), Number(raw[1] || 0)];
    if (typeof raw === "string" && raw.trim()) {
        const [x = "0", y = "0"] = raw.split(",").map((item) => item.trim());
        return [Number(x) || 0, Number(y) || 0];
    }
    return [0, 0];
};

const toStyleObject = (style: BadgeProps["badgeStyle"]): Record<string, string | number> => {
    if (!style || typeof style === "string") return {};
    return style;
};

const badgeStyle = (): Record<string, string | number> => {
    const [x, y] = offset();
    return {
        ...(props.color ? { backgroundColor: props.color } : {}),
        ...toStyleObject(props.badgeStyle),
        "--_badge-offset-x": `${x}px`,
        "--_badge-offset-y": `${y}px`,
    };
};

const shouldShow = (): boolean => {
    if (props.hidden === true) return false;
    if (props.isDot === true) return true;

    const content = toBadgeValue(props.content);
    const value = content === "" ? toBadgeValue(props.value) : content;
    if (value === "") return false;
    if (value === "0" || value === 0) return props.showZero === true;

    return true;
};

const Badge = defineHtml<BadgeProps>(html`
    <div class="badge-wrapper" part="wrapper">
        <slot></slot>
        <sup v-if=${shouldShow()} :class=${["badge", props.badgeClass]} part="badge" :style=${badgeStyle()}>
            <span v-if=${!props.isDot}>
                <slot name="content">${formatValue()}</slot>
            </span>
        </sup>
    </div>
`);

defineStyle(styles);

export { Badge };
