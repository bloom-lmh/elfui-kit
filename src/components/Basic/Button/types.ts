// elf-button 类型定义

/** Button 变体 */
export type ButtonVariant = "contained" | "outlined" | "text";

/** Button 颜色 */
export type ButtonColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

/** Button 尺寸 */
export type ButtonSize = "sm" | "md" | "lg";

/** Button 原生 type */
export type ButtonType = "button" | "submit" | "reset";

/** Button 形状 */
export type ButtonShape = "default" | "round" | "circle" | "square";

/** Button props 完整类型（用于外部消费方做类型推导） */
export interface ButtonProps {
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
  loading: boolean;
  block: boolean;
  type: ButtonType;
  /** 加 plain 让 contained 变成"低饱和度"风格（element-plus 风格） */
  plain: boolean;
  /** 加 dashed 让 outlined 变成虚线 */
  dashed: boolean;
  /** autofocus 透传 */
  autofocus: boolean;
  /** native form attribute */
  form: string;
}

/** Button 对外事件 */
export type ButtonEmits = {
  click: [event: MouseEvent];
};

/** Button 支持的 slots */
export interface ButtonSlots {
  default?: () => unknown;
  icon?: () => unknown;
  "suffix-icon"?: () => unknown;
}
