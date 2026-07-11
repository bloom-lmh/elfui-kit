// elf-avatar — Material Design 头像组件
//
// 使用：
//   <elf-avatar alt="张三"></elf-avatar>
//   <elf-avatar src="https://..." alt="李四"></elf-avatar>
//   <elf-avatar icon="★" color="primary"></elf-avatar>
//   <elf-avatar size="lg" shape="square" alt="Admin"></elf-avatar>
//
// part: avatar — 用户可用 ::part(avatar) 自定义外观
// 逻辑：
// - 有 src 且图片加载成功 → 显示图片
// - 有 icon → 显示图标
// - 否则 → 显示 alt 首字母缩写

import { defineProps, defineStyle, html, useComputed, useRef, defineHtml } from "elfui";

import styles from "./style.scss?inline";
import type { AvatarProps } from "./types";

export type { AvatarProps, AvatarShape, AvatarSize } from "./types";

// ───── 颜色哈希（基于名字生成稳定的背景色） ────────
const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
  "#00838f",
  "#c62828"
];

const hashColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length]!;
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
};

const props = defineProps({
  size: { type: String, default: "md" },
  shape: { type: String, default: "circle" },
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  icon: { type: String, default: "" },
  color: { type: String, default: "" }
}) as unknown as Readonly<AvatarProps>;

const imgError = useRef(false);

const onImgError = (): void => {
  imgError.set(true);
};

const showImage = useComputed(() => !!toText(props.src) && !imgError.peek());

const initials = useComputed(() => {
  const name = toText(props.alt);
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const bgColor = useComputed(() => {
  const color = toText(props.color);
  if (color) return color;
  return hashColor(toText(props.alt) || "?");
});

defineStyle(styles);

const Avatar = defineHtml(html`
  <div class="avatar" part="avatar" :style=${{ backgroundColor: bgColor }}>
    <img v-if=${showImage} :src=${props.src} :alt=${props.alt} @error=${onImgError} />
    <span v-else-if=${props.icon} class="icon">${props.icon}</span>
    <span v-else class="initials">${initials}</span>
  </div>
`);

export { Avatar };
