// elf-tooltip 类型定义

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipEffect = "dark" | "light";
export type TooltipTrigger = "hover" | "focus" | "click" | "contextmenu" | "manual";

export interface TooltipProps {
  /** 提示内容 */
  content?: string;
  /** 弹出位置，默认 top */
  placement?: TooltipPlacement;
  /** 是否禁用 */
  disabled?: boolean;
  /** 触发方式，默认 hover */
  trigger?: TooltipTrigger;
  /** 延迟显示，单位毫秒 */
  showAfter?: number;
  /** 延迟隐藏，单位毫秒 */
  hideAfter?: number;
  /** 主题风格，默认 dark */
  effect?: TooltipEffect;
  /** 是否受控显示（用于 manual 模式） */
  visible?: boolean;
}
