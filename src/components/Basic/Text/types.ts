export type TextType = "primary" | "success" | "warning" | "danger" | "info" | "";
export type TextSize = "sm" | "md" | "lg" | "";

export interface TextProps {
  type: TextType;
  size: TextSize;
  truncated: boolean;
  lineClamp?: number;
  tag: string;
  mark: boolean;
  deleted: boolean;
  inserted: boolean;
  strong: boolean;
  italic: boolean;
}

export interface TextSlots {
  default?: unknown;
}
