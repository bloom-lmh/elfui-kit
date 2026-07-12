export type TagColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export type TagSize = "sm" | "md" | "lg";

export type TagVariant = "filled" | "light" | "outlined";

export type TagEffect = "dark" | "light" | "plain";

export interface TagProps {
  type: TagColor;
  color: TagColor;
  size: TagSize;
  variant: TagVariant;
  effect: TagEffect;
  closable: boolean;
  round: boolean;
  disabled: boolean;
  disableTransitions: boolean;
  hit: boolean;
  checked?: boolean;
}

export type TagEmits = {
  click: [event: MouseEvent];
  close: [event: Event];
  change: [checked: boolean];
  "update:checked": [checked: boolean];
};
