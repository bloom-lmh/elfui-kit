export type InputTagSize = "sm" | "md" | "lg" | "";

export interface InputTagProps {
  modelValue: string[];
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  clearable: boolean;
  max?: number;
  size: InputTagSize;
}
