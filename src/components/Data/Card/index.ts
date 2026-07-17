// elf-card — Material Design 3 卡片
//
// 用法：
//   <elf-card title="标题" subtitle="副标题" image="..." overlay="推荐">
//     <p>卡片内容</p>
//     <template #footer><elf-button>确认</elf-button></template>
//   </elf-card>
//
//   <elf-card variant="outlined" clickable avatar="..." title="用户">
//     <template #extra><elf-tag>VIP</elf-tag></template>
//     <p>简介</p>
//   </elf-card>

import {
    defineEmits,
    defineProps,
    defineStyle,
    html,
    useComputed,
    useHostAttr,
    useHostCssVar,
    useHostFlag,
    useRef,
    defineHtml,
} from "elfui";

import styles from "./style.scss?inline";
import type { CardDensity, CardProps, CardShadow, CardVariant } from "./types";

export type { CardBodyStyle, CardDensity, CardProps, CardShadow, CardVariant } from "./types";

const props = defineProps({
    header: { type: String, default: "" },
    footer: { type: String, default: "" },
    bodyStyle: { type: Object, default: () => ({}) },
    headerClass: { type: String, default: "" },
    bodyClass: { type: String, default: "" },
    footerClass: { type: String, default: "" },
    shadow: { type: String, default: "always" },
    variant: { type: String, default: "elevated" },
    density: { type: String, default: "default" },
    avatar: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePlacement: { type: String, default: "top" },
    imageHeight: { type: String, default: "200px" },
    imageWidth: { type: String, default: "40%" },
    overlay: { type: String, default: "" },
    clickable: { type: Boolean, default: false },
}) as unknown as Readonly<CardProps>;

const emit = defineEmits(["click"]);

const showImage = useComputed(() => !!props.image);
const showOverlay = useComputed(() => !!props.image && !!props.overlay);
const hasHeaderSlot = useRef(false);
const hasFooterSlot = useRef(false);
const hasCoverSlot = useRef(false);
const showHeader = useComputed(() =>
    Boolean(props.header || props.title || props.subtitle || props.avatar || hasHeaderSlot.value),
);
const showFooter = useComputed(() => Boolean(props.footer || hasFooterSlot.value));
const showCover = useComputed(() => Boolean(props.image || hasCoverSlot.value));

const normalizedShadow = (): CardShadow => {
    const shadow = String(props.shadow || "always") as CardShadow;
    return shadow === "hover" || shadow === "never" ? shadow : "always";
};

const normalizedVariant = (): CardVariant => {
    const variant = String(props.variant || "elevated") as CardVariant;
    return ["outlined", "filled", "tonal", "flat"].includes(variant) ? variant : "elevated";
};

const normalizedDensity = (): CardDensity => {
    const density = String(props.density || "default") as CardDensity;
    return density === "comfortable" || density === "compact" ? density : "default";
};

const onSlotChange =
    (target: "header" | "footer" | "cover") =>
    (event: Event): void => {
        const slot = event.target as HTMLSlotElement;
        const hasContent = slot.assignedNodes().some((node) => (node.textContent?.trim() ?? "") !== "");
        if (target === "header") hasHeaderSlot.set(hasContent);
        if (target === "footer") hasFooterSlot.set(hasContent);
        if (target === "cover") hasCoverSlot.set(hasContent);
    };

const handleClick = (event: Event): void => {
    if (!props.clickable) return;
    event.stopPropagation();
    emit("click");
};

const handleKeydown = (event: KeyboardEvent): void => {
    if (!props.clickable || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    emit("click");
};

useHostAttr("variant", normalizedVariant);
useHostAttr("shadow", normalizedShadow);
useHostAttr("density", normalizedDensity);
useHostAttr("image-placement", () => props.imagePlacement || "top");
useHostFlag("clickable", () => Boolean(props.clickable));
useHostFlag("has-header", () => showHeader.value);
useHostFlag("has-footer", () => showFooter.value);
useHostFlag("has-cover", () => showCover.value);
useHostCssVar("--_image-h", () => String(props.imageHeight || "200px"));
useHostCssVar("--_image-w", () => String(props.imageWidth || "40%"));

defineStyle(styles);

const Card = defineHtml(html`
    <div class="card-image-wrap" v-show=${showCover} @click=${handleClick}>
        <img v-if=${showImage} :src=${props.image} alt="" />
        <slot name="cover" @slotchange=${onSlotChange("cover")}></slot>
        <div class="image-overlay" v-if=${showOverlay}>${props.overlay}</div>
    </div>

    <div
        class="card-content"
        :role=${props.clickable ? "button" : null}
        :tabindex=${props.clickable ? 0 : null}
        @click=${handleClick}
        @keydown=${handleKeydown}
    >
        <div class="header" v-show=${showHeader} :class=${props.headerClass}>
            <slot name="header" @slotchange=${onSlotChange("header")}>
                <img class="avatar" v-if=${props.avatar} :src=${props.avatar} alt="" />
                <div class="header-text" v-if=${props.title || props.subtitle || props.header}>
                    <div class="title" v-if=${props.title || props.header}>
                        <slot name="title">${props.title || props.header}</slot>
                    </div>
                    <div class="subtitle" v-if=${props.subtitle}>${props.subtitle}</div>
                </div>
                <div class="extra"><slot name="extra"></slot></div>
            </slot>
        </div>

        <div class="body" :class=${props.bodyClass} :style=${props.bodyStyle}>
            <slot></slot>
        </div>

        <div class="footer" v-show=${showFooter} :class=${props.footerClass}>
            <slot name="footer" @slotchange=${onSlotChange("footer")}>${props.footer}</slot>
        </div>
    </div>
`);

export { Card };
