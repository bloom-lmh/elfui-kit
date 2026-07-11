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
  defineHtml
} from "elfui";

import styles from "./style.scss?inline";
import type { CardProps } from "./types";

export type { CardProps, CardShadow, CardVariant } from "./types";

const props = defineProps({
  variant: { type: String, default: "elevated" },
  avatar: { type: String, default: "" },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  image: { type: String, default: "" },
  imagePlacement: { type: String, default: "top" },
  imageHeight: { type: String, default: "200px" },
  imageWidth: { type: String, default: "40%" },
  overlay: { type: String, default: "" },
  clickable: { type: Boolean, default: false }
}) as unknown as Readonly<CardProps>;

const emit = defineEmits(["click"]);

const showImage = useComputed(() => !!props.image);
const showOverlay = useComputed(() => !!props.image && !!props.overlay);
const showHeader = useComputed(() => !!props.title || !!props.subtitle || !!props.avatar);

const handleClick = (event: Event): void => {
  if (!props.clickable) return;
  event.stopPropagation();
  emit("click");
};

useHostAttr("variant", () => props.variant || "elevated");
useHostAttr("image-placement", () => props.imagePlacement || "top");
useHostFlag("clickable", () => Boolean(props.clickable));
useHostCssVar("--_image-h", () => String(props.imageHeight || "200px"));
useHostCssVar("--_image-w", () => String(props.imageWidth || "40%"));

defineStyle(styles);

const Card = defineHtml(html`
  <div class="card-image-wrap" @click=${handleClick}>
    <img v-if=${showImage} :src=${props.image} alt="" />
    <slot name="cover"></slot>
    <div class="image-overlay" v-if=${showOverlay}>${props.overlay}</div>
  </div>

  <div class="card-content" @click=${handleClick}>
    <div class="header">
      <img class="avatar" v-if=${props.avatar} :src=${props.avatar} alt="" />
      <div class="header-text" v-if=${props.title || props.subtitle}>
        <div class="title" v-if=${props.title}><slot name="title">${props.title}</slot></div>
        <div class="subtitle" v-if=${props.subtitle}>${props.subtitle}</div>
      </div>
      <div class="extra"><slot name="extra"></slot></div>
      <slot name="header"></slot>
    </div>

    <div class="body">
      <slot></slot>
    </div>

    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
`);

export { Card };
