// elf-button — Material Design + Element Plus 风格按钮

import { defineEmits, defineHtml, defineProps, defineStyle, html, useHostAttr, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { ButtonEmits, ButtonProps, ButtonSlots, ButtonType, ButtonVariant } from "./types";

export type {
    ButtonColor,
    ButtonEmits,
    ButtonProps,
    ButtonShape,
    ButtonSize,
    ButtonSlots,
    ButtonType,
    ButtonVariant,
} from "./types";

const props = defineProps<ButtonProps>({
    type: { type: String, default: "" },
    variant: { type: String, default: "contained" },
    color: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    shape: { type: String, default: "default" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    text: { type: Boolean, default: false },
    bg: { type: Boolean, default: false },
    link: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    plain: { type: Boolean, default: false },
    dashed: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    form: { type: String, default: "" },
    nativeType: { type: String, default: "button" },
    icon: { type: String, default: "" },
    loadingIcon: { type: String, default: "" },
    autoInsertSpace: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
    noHover: { type: Boolean, default: false },
    tag: { type: String, default: "button" },
    direction: { type: String, default: "horizontal" },
});

defineEmits<ButtonEmits>();
defineStyle(styles);

const handleClick = (event: Event): void => {
    if (props.disabled || props.loading) {
        event.preventDefault();
        event.stopPropagation();
    }
};

const colorTypes = ["primary", "secondary", "success", "warning", "danger", "info"];
const nativeTypes = ["button", "submit", "reset"];

const normalizedColor = (): string => {
    const type = String(props.type || "");
    if (colorTypes.includes(type)) return type;
    return colorTypes.includes(String(props.color)) ? String(props.color) : "primary";
};

const normalizedVariant = (): ButtonVariant => {
    if (props.link || props.text) return "text";
    return props.variant === "outlined" || props.variant === "text" ? props.variant : "contained";
};

const normalizedSize = (): "sm" | "md" | "lg" => {
    if (props.size === "small") return "sm";
    if (props.size === "large") return "lg";
    if (props.size === "default") return "md";
    return props.size === "sm" || props.size === "lg" ? props.size : "md";
};

const normalizedNativeType = (): ButtonType => {
    const type = String(props.type || "");
    if (nativeTypes.includes(type)) return type as ButtonType;
    return nativeTypes.includes(String(props.nativeType)) ? (props.nativeType as ButtonType) : "button";
};

useHostAttr("color", normalizedColor);
useHostAttr("variant", normalizedVariant);
useHostAttr("size", normalizedSize);
useHostFlag("round", () => Boolean(props.round || props.shape === "round"));
useHostFlag("circle", () => Boolean(props.circle || props.shape === "circle"));
useHostFlag("text", () => Boolean(props.text));
useHostFlag("bg", () => Boolean(props.bg));
useHostFlag("link", () => Boolean(props.link));
useHostFlag("dark", () => Boolean(props.dark));
useHostFlag("block", () => Boolean(props.block));
useHostFlag("plain", () => Boolean(props.plain));
useHostFlag("dashed", () => Boolean(props.dashed));
useHostFlag("no-hover", () => Boolean(props.noHover));
useHostAttr("direction", () => (props.direction === "vertical" ? "vertical" : "horizontal"));

const Button = defineHtml<ButtonProps, ButtonEmits, ButtonSlots>(html`
    <button
        part="button"
        :type=${normalizedNativeType()}
        :disabled=${props.disabled || props.loading}
        :aria-busy=${props.loading}
        :autofocus=${props.autofocus}
        :form=${props.form || null}
        @click=${handleClick}
    >
        <slot v-if=${props.loading} name="loading">
            <span v-if=${props.loadingIcon} class="prop-icon" aria-hidden="true">${props.loadingIcon}</span>
            <span v-else class="spinner" aria-hidden="true"></span>
        </slot>
        <slot v-if=${!props.loading} name="icon">
            <span v-if=${props.icon} class="prop-icon" aria-hidden="true">${props.icon}</span>
        </slot>
        <slot></slot>
        <slot name="suffix-icon"></slot>
    </button>
`);

export { Button };
