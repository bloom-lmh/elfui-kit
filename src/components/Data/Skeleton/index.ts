// elf-skeleton — Material Design 骨架屏
//
// 基础用法：
//   <elf-skeleton />
//   <elf-skeleton variant="text" count="3" gap="12px" />
//   <elf-skeleton variant="circle" width="64px" height="64px" />
//   <elf-skeleton variant="rect" width="100%" height="200px" />
//
// 组合用法（通过 slot 组合出任意骨架布局）：
//   <elf-skeleton variant="card">
//     <elf-skeleton variant="rect" height="180px" />
//     <elf-skeleton variant="text" count="3" style="margin:16px 20px" />
//   </elf-skeleton>
//
//   <elf-skeleton variant="list" count="3">
//     <elf-skeleton variant="circle" width="48px" height="48px" slot="avatar" />
//     <elf-skeleton variant="text" count="2" slot="content" />
//   </elf-skeleton>

import { defineProps, defineStyle, html, useComputed, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { SkeletonProps } from "./types";

export type { SkeletonProps, SkeletonVariant } from "./types";

const props = defineProps({
  variant: { type: String, default: "text" },
  width: { type: String, default: "" },
  height: { type: String, default: "" },
  animated: { type: Boolean, default: true },
  count: { type: Number, default: 1 },
  gap: { type: String, default: "12px" }
}) as unknown as Readonly<SkeletonProps>;

const defaultSize = useComputed(() => {
  switch (props.variant) {
    case "circle":
      return { w: "48px", h: "48px" };
    case "rect":
      return { w: "100%", h: "48px" };
    case "image":
      return { w: "100%", h: "200px" };
    default:
      return { w: "100%", h: "16px" };
  }
});

const w = useComputed(() => props.width || defaultSize.peek().w);
const h = useComputed(() => props.height || defaultSize.peek().h);
const items = useComputed(() =>
  Array.from({ length: Math.max(1, Number(props.count)) }, (_, i) => i)
);

defineStyle(styles);

const Skeleton = defineHtml(html`
  <div class="wrapper" :style=${{ gap: props.count > 1 ? props.gap : "0" }}>
    <div
      v-for="(_item, _index) in items"
      :key="_index"
      class="skeleton"
      part="skeleton"
      :style=${{ width: w, height: h }}
    ></div>
  </div>
`);

export { Skeleton };
