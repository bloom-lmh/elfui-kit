// elf-input 类型

export type InputType =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "number"
  | "date"
  | "datetime-local"
  | "month"
  | "time"
  | "week";

export type InputSize = "sm" | "md" | "lg" | "small" | "default" | "large";

export type InputWordLimitPosition = "inside" | "outside";

export type InputNativeValue = string | number;

export interface InputModelModifiers {
  trim?: boolean;
  number?: boolean;
  lazy?: boolean;
}

export type InputFormatter = (value: string) => string;

export type InputParser = (value: string) => string;

export type InputGraphemeCounter = (value: string) => number;

export interface InputProps {
  modelValue: InputNativeValue;
  modelModifiers: InputModelModifiers;
  type: InputType;
  size: InputSize;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  clearable: boolean;
  maxlength: number | undefined;
  minlength: number | undefined;
  showWordLimit: boolean;
  wordLimitPosition: InputWordLimitPosition;
  clearIcon: string;
  formatter?: InputFormatter;
  parser?: InputParser;
  showPassword: boolean;
  prefixIcon: string;
  suffixIcon: string;
  autocomplete: string;
  max: string | number | undefined;
  min: string | number | undefined;
  step: string | number | undefined;
  autofocus: boolean;
  form: string;
  ariaLabel: string;
  tabindex: string | number | undefined;
  validateEvent: boolean;
  inputStyle: string | Record<string, string | number>;
  label: string;
  inputmode: string;
  countGraphemes?: InputGraphemeCounter;
  id: string;
  name: string;
}
