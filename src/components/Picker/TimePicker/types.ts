import type { FieldVariant } from "../../../types/field";

export interface TimeShortcut {
  label: string;
  value: string;
  endValue?: string;
}

export type TimePickerModelValue = string | [string, string];
export type TimePickerSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";
export type TimePickerVariant = FieldVariant;

export interface TimePickerProps {
  modelValue: TimePickerModelValue;
  endValue: string;
  range: boolean;
  isRange: boolean;
  min: string;
  max: string;
  step: number;
  readonly: boolean;
  editable: boolean;
  size: TimePickerSize;
  variant: TimePickerVariant;
  label: string;
  placeholder: string;
  startPlaceholder: string;
  endPlaceholder: string;
  rangeSeparator: string;
  disabled: boolean;
  clearable: boolean;
  id: string | [string, string];
  name: string;
  tabindex: string | number;
  valueOnClear: string | [string, string] | (() => string | [string, string]) | undefined;
  emptyValues: unknown[];
  saveOnBlur: boolean;
  shortcuts: TimeShortcut[];
}
