import { defineHtml, defineProps, defineStyle, html, useHostCssVar } from "elfui";

import styles from "./style.scss?inline";
import type { DescriptionsItemAlign, DescriptionsItemProps, DescriptionsItemSlots } from "./types";

export type { DescriptionsItemAlign, DescriptionsItemProps, DescriptionsItemSlots } from "./types";

const props = defineProps<DescriptionsItemProps>({
    label: { type: String, default: "" },
    span: { type: Number, default: 1 },
    align: { type: String, default: "" },
    labelAlign: { type: String, default: "" },
    labelWidth: { type: [String, Number], default: "" },
    className: { type: String, default: "" },
});

const normalizeAlign = (value: unknown): DescriptionsItemAlign => {
    const candidate = String(value || "");
    return candidate === "left" || candidate === "center" || candidate === "right" ? candidate : "";
};

const span = (): number => Math.max(1, Math.floor(Number(props.span) || 1));
const cssSize = (value: string | number): string =>
    typeof value === "number" ? `${Math.max(0, value)}px` : String(value || "auto");

useHostCssVar("--_descriptions-item-span", () => String(span()));
useHostCssVar("--_descriptions-item-align", () => normalizeAlign(props.align) || "left");
useHostCssVar("--_descriptions-item-label-align", () => normalizeAlign(props.labelAlign) || "left");
useHostCssVar("--_descriptions-item-label-width", () => cssSize(props.labelWidth));

defineStyle(styles);

const DescriptionsItem = defineHtml<DescriptionsItemProps, Record<string, never>, DescriptionsItemSlots>(html`
    <div class="item" :class=${props.className} part="item">
        <div class="label" part="label"><slot name="label">${props.label}</slot></div>
        <div class="content" part="content"><slot></slot></div>
    </div>
`);

export { DescriptionsItem };
