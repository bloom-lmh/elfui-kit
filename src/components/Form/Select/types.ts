// elf-select 类型

import type { FieldVariant } from "../../../types/field";

export type SelectSize = "small" | "default" | "large" | "sm" | "md" | "lg";
export type SelectVariant = FieldVariant;
export type SelectPrimitiveValue = string | number | boolean;
export type SelectValue = SelectPrimitiveValue | Record<string, unknown>;

export interface SelectFieldNames {
  value?: string;
  label?: string;
  disabled?: string;
  options?: string;
}

export interface SelectOption {
  label?: string;
  value?: SelectValue;
  disabled?: boolean;
  options?: SelectOption[];
  [key: string]: unknown;
}

export interface SelectProps {
  modelValue: SelectValue | SelectValue[];
  options: SelectOption[];
  props: SelectFieldNames;
  size: SelectSize;
  variant: SelectVariant;
  label: string;
  placeholder: string;
  disabled: boolean;
  valueKey: string;
  clearable: boolean;
  multiple: boolean;
  collapseTags: boolean;
  maxCollapseTags: number;
  collapseTagsTooltip: boolean;
  multipleLimit: number;
  filterable: boolean;
  allowCreate: boolean;
  filterMethod?: (query: string, option?: SelectOption) => boolean;
  remote: boolean;
  remoteMethod?: (query: string) => void;
  debounce: number;
  reserveKeyword: boolean;
  defaultFirstOption: boolean;
  automaticDropdown: boolean;
  loading: boolean;
  loadingText: string;
  noDataText: string;
  noMatchText: string;
  valueOnClear: SelectValue | SelectValue[] | (() => SelectValue | SelectValue[]);
  emptyValues: unknown[];
  height: number;
  fitInputWidth: boolean;
  tabindex: string | number;
  id: string;
  name: string;
}
