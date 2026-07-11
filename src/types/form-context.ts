// Form 上下文类型

import type {
  FormProps,
  FormRule,
  FormRules,
  RuleTrigger,
  ValidateField
} from "../components/Form/Form/types";
import type { FormItemSize, FormItemValidateState } from "../components/Form/FormItem/types";

export interface FormContext {
  model: Record<string, unknown>;
  rules: FormRules;
  size: FormItemSize;
  disabled: boolean;
  labelPosition: FormProps["labelPosition"];
  labelWidth: string;
  hideRequiredAsterisk: boolean;
  registerItem(item: FormItemContext): () => void;
  unregisterItem(item: FormItemContext): void;
  validateField: ValidateField;
  validate(): Promise<boolean>;
  resetFields(): void;
  clearValidate(props?: string | string[]): void;
}

export interface FormItemContext {
  prop: string;
  initialValue: unknown;
  state: FormItemValidateState;
  message: string;
  rules: FormRule[];
  size: FormItemSize;
  validateTrigger(trigger: RuleTrigger): void;
  validate(trigger?: RuleTrigger): Promise<boolean>;
  clearValidate(): void;
  resetField(): void;
}

export interface CheckboxGroupContext {
  modelValue: unknown[];
  disabled: boolean;
  size: "sm" | "md" | "lg";
  min: number;
  max: number;
  changeEvent(v: unknown[]): void;
}

export interface RadioGroupContext {
  modelValue: unknown;
  disabled: boolean;
  size: "sm" | "md" | "lg";
  changeEvent(v: unknown): void;
}
