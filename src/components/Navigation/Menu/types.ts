export type MenuMode = "vertical" | "horizontal";
export type MenuTheme = "light" | "dark";
export type MenuTogglePlacement = "footer" | "header";

export interface MenuFieldNames {
  index?: string;
  label?: string;
  title?: string;
  icon?: string;
  disabled?: string;
  children?: string;
  badge?: string;
  divider?: string;
  group?: string;
  route?: string;
  popperClass?: string;
  teleported?: string;
}

export interface MenuItem {
  index?: string;
  label?: string;
  title?: string;
  icon?: string;
  disabled?: boolean;
  children?: MenuItem[];
  badge?: string | number;
  divider?: boolean;
  group?: string;
  route?: string | Record<string, unknown>;
  popperClass?: string;
  teleported?: boolean;
  [key: string]: unknown;
}

export interface MenuProps {
  items: MenuItem[];
  modelValue: string;
  defaultActive: string;
  defaultOpeneds: string[];
  mode: MenuMode;
  theme: MenuTheme;
  collapse: boolean;
  ellipsis: boolean;
  ellipsisIcon: string;
  popperOffset: number;
  menuTrigger: "hover" | "click";
  collapseTransition: boolean;
  popperEffect: string;
  closeOnClickOutside: boolean;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  showTimeout: number;
  hideTimeout: number;
  persistent: boolean;
  uniqueOpened: boolean;
  router: boolean;
  props: MenuFieldNames;
  backgroundColor: string;
  textColor: string;
  activeTextColor: string;
  activeBackground: string;
  width: string;
  collapseWidth: string;
  indent: number;
  rounded: boolean;
  elevation: boolean;
  bordered: boolean;
  showToggle: boolean;
  togglePlacement: MenuTogglePlacement;
  searchable: boolean;
  searchPlaceholder: string;
}
