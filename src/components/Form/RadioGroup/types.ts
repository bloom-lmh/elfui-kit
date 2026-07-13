export interface RadioGroupProps {
  modelValue: unknown;
  disabled: boolean;
  size: "sm" | "md" | "lg";
  variant: "default" | "button";
  fill: string;
  textColor: string;
  id: string;
  name: string;
  ariaLabel: string;
  label: string;
  validateEvent: boolean;
}
