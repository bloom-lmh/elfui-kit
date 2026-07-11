export type DatePickerType = "date" | "datetime-local" | "month" | "week";

export type DatePickerValue = string | string[];

export interface DateShortcut {
  label: string;
  value: string | (() => string);
  endValue?: string | (() => string);
}

export interface DatePickerProps {
  modelValue: DatePickerValue;
  endValue: string;
  type: DatePickerType;
  range: boolean;
  multiple: boolean;
  actions: boolean;
  showHeader: boolean;
  header: string;
  min: string;
  max: string;
  placeholder: string;
  endPlaceholder: string;
  disabled: boolean;
  clearable: boolean;
  shortcuts: DateShortcut[];
  confirmText: string;
  cancelText: string;
  clearText: string;
}
