export type InputOtpType = "text" | "number" | "password";
export type InputOtpSize = "sm" | "md" | "lg" | "";

export interface InputOtpProps {
  modelValue: string;
  length: number;
  type: InputOtpType;
  size: InputOtpSize;
  disabled: boolean;
  readonly: boolean;
  placeholder: string;
  separator: string;
}
