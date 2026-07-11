// elf-tag 类型

export type TagColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export type TagSize = "sm" | "md" | "lg";

export type TagVariant = "filled" | "light" | "outlined";

export interface TagProps {
  color: TagColor;
  size: TagSize;
  variant: TagVariant;
  /** 显示关闭按钮 */
  closable: boolean;
  /** 圆形 */
  round: boolean;
  /** 禁用 */
  disabled: boolean;
}
