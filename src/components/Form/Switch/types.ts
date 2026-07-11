export type SwitchSize = "sm" | "md" | "lg";

export type SwitchColor = "primary" | "success" | "warning" | "danger" | "info" | string;

export type SwitchLabelPosition = "start" | "end";

export interface SwitchProps {
  modelValue: boolean;
  disabled: boolean;
  size: SwitchSize;
  activeText: string;
  inactiveText: string;
  label: string;
  labelPosition: SwitchLabelPosition;
  beforeChange?: (next: boolean) => boolean | Promise<boolean>;
  loading: boolean;
  inset: boolean;
  flat: boolean;
  color: SwitchColor;
  activeColor: string;
  inactiveColor: string;
}
