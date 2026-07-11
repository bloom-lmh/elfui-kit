// elf-radio 类型

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps {
  modelValue: string | number | boolean;
  value: string | number | boolean;
  label: string;
  disabled: boolean;
  size: RadioSize;
  /** 在 group 中显示为按钮风格 */
  border: boolean;
}
