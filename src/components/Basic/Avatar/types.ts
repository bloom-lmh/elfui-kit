// elf-avatar 类型定义

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export interface AvatarProps {
  /** 尺寸，默认 md (40px) */
  size: AvatarSize;
  /** 形状，默认 circle */
  shape: AvatarShape;
  /** 图片地址 */
  src: string;
  /** 图片 alt 文本，同时用作文字头像的首字母来源 */
  alt: string;
  /** 图标名（仅展示一个 Unicode / emoji） */
  icon: string;
  /** 自定义背景色 */
  color: string;
}
