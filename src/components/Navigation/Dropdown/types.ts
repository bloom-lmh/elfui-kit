// elf-dropdown 类型定义

export type DropdownTrigger = "click" | "hover" | "contextmenu";
export type DropdownPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";
export type DropdownSize = "sm" | "md" | "lg";
export type DropdownButtonType = "default" | "primary" | "success" | "warning" | "danger" | "info";
export type DropdownEffect = "light" | "dark" | string;

export interface DropdownButtonProps {
  class?: string;
  style?: Record<string, string | number>;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface DropdownFieldNames {
  label?: string;
  command?: string;
  icon?: string;
  disabled?: string;
  divided?: string;
  shortcut?: string;
  children?: string;
}

export interface DropdownItem {
  label?: string;
  command?: string;
  icon?: string;
  disabled?: boolean;
  divided?: boolean;
  shortcut?: string;
  children?: DropdownItem[];
  [key: string]: unknown;
}

export interface DropdownCommandDetail {
  command: string;
  item: DropdownItem;
}

export interface DropdownProps {
  items: DropdownItem[];
  label: string;
  trigger: DropdownTrigger;
  placement: DropdownPlacement;
  size: DropdownSize;
  type: DropdownButtonType;
  buttonProps: DropdownButtonProps;
  effect: DropdownEffect;
  triggerKeys: string[];
  virtualTriggering: boolean;
  virtualRef?: HTMLElement | null;
  showArrow: boolean;
  showTimeout: number;
  hideTimeout: number;
  role: string;
  tabindex: number;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  popperOptions: Record<string, unknown>;
  teleported: boolean;
  appendTo: string | HTMLElement;
  persistent: boolean;
  closeOnClickOutside: boolean;
  disabled: boolean;
  hideOnClick: boolean;
  splitButton: boolean;
  maxHeight: string;
  props: DropdownFieldNames;
}

export type DropdownEmits = {
  command: [detail: DropdownCommandDetail];
  "visible-change": [visible: boolean];
  click: [event: Event];
};

export interface DropdownSlots {
  default?: () => unknown;
  trigger?: () => unknown;
  main?: () => unknown;
  dropdown?: () => unknown;
}

export interface DropdownExpose {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}

export type DropdownElement = HTMLElement & DropdownExpose & Partial<DropdownProps>;
