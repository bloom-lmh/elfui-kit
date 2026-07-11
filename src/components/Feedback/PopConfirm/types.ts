// elf-pop-confirm 类型定义

export type PopConfirmPlacement = "top" | "bottom" | "left" | "right";
export type PopConfirmTrigger = "click" | "hover" | "focus" | "manual";

export interface PopConfirmProps {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  placement: PopConfirmPlacement;
  trigger: PopConfirmTrigger;
  visible: boolean | undefined;
  width: string;
  disabled: boolean;
  closeOnEscape: boolean;
  closeOnClickOutside: boolean;
}
