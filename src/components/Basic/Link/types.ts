export type LinkType = "default" | "primary" | "success" | "warning" | "danger" | "info";

export interface LinkProps {
  type: LinkType;
  underline: boolean;
  disabled: boolean;
  href: string;
  target: string;
  icon: string;
}

export interface LinkSlots {
  default?: unknown;
  icon?: unknown;
}
