// elf-badge 类型定义

/** Badge 颜色类型（与 Button 共享一套 token） */
export type BadgeType = "primary" | "success" | "warning" | "danger" | "info";

/** Badge props 完整类型 */
export interface BadgeProps {
  /** 显示值（string 渲染为文本；number 走 max 截断） */
  value: string | number;
  /** 最大值，超出显示为 "max+"，默认 99 */
  max: number;
  /** 是否显示为圆点（忽略 value） */
  isDot: boolean;
  /** 是否隐藏 */
  hidden: boolean;
  /** 颜色类型，默认 "danger"（Material Design badge 语义为通知） */
  type: BadgeType;
  /** value 为 0 时是否显示（isDot 模式下始终显示） */
  showZero: boolean;
  /** 自定义背景色（CSS 颜色值），设置后 type 失效 */
  color: string;
}
