// elf-checkbox-group 类型

export interface CheckboxGroupProps {
  modelValue: unknown[];
  disabled: boolean;
  size: "sm" | "md" | "lg";
  min: number;
  max: number;
  ariaLabel: string;
}
