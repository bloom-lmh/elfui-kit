// elf-textarea 类型

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps {
  modelValue: string;
  size: TextareaSize;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  maxlength: number | undefined;
  showCount: boolean;
  rows: number;
  autosize: boolean | { minRows?: number; maxRows?: number };
  resize: "none" | "both" | "horizontal" | "vertical";
}
