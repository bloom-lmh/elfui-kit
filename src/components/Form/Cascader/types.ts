export type CascaderValue = string | number | boolean;
export type CascaderPathValue = CascaderValue[];
export type CascaderMultipleValue = CascaderPathValue[];
export type CascaderModelValue =
  | CascaderValue
  | CascaderPathValue
  | CascaderValue[]
  | CascaderMultipleValue;
export type CascaderSize = "small" | "default" | "large" | "sm" | "md" | "lg";
export type CascaderExpandTrigger = "click" | "hover";
export type CascaderShowCheckedStrategy = "child" | "parent";

export interface CascaderOption {
  label?: string;
  value?: CascaderValue;
  disabled?: boolean;
  children?: CascaderOption[];
  [key: string]: unknown;
}

export interface CascaderFieldNames {
  label?: string;
  value?: string;
  disabled?: string | ((data: CascaderOption) => boolean);
  children?: string;
  leaf?: string | ((data: CascaderOption) => boolean);
  expandTrigger?: CascaderExpandTrigger;
  multiple?: boolean;
  checkStrictly?: boolean;
  emitPath?: boolean;
  lazy?: boolean;
  lazyLoad?: (
    node: unknown,
    resolve: (data: CascaderOption[]) => void,
    reject?: () => void
  ) => void;
  hoverThreshold?: number;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  showPrefix?: boolean;
}

export interface CascaderChangeDetail {
  value: CascaderModelValue;
  path: string[] | string[][];
  selected: CascaderOption[] | CascaderOption[][];
  multiple: boolean;
}

export interface CascaderProps {
  modelValue: CascaderModelValue;
  options: CascaderOption[];
  size: CascaderSize | "";
  placeholder: string;
  disabled: boolean;
  clearable: boolean;
  multiple: boolean;
  checkable: boolean;
  separator: string;
  props: CascaderFieldNames;
  showAllLevels: boolean;
  collapseTags: boolean;
  collapseTagsTooltip: boolean;
  maxCollapseTags: number;
  maxCollapseTagsTooltipHeight: string | number;
  checkStrictly: boolean;
  emitPath: boolean;
  expandTrigger: CascaderExpandTrigger;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  showPrefix: boolean;
  showCheckedStrategy: CascaderShowCheckedStrategy;
  filterable: boolean;
  debounce: number;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
}

export interface CascaderNodeSnapshot {
  value: CascaderValue;
  label: string;
  level: number;
  data: CascaderOption;
  pathValues: CascaderPathValue;
  pathLabels: string[];
  checked: boolean;
  isLeaf: boolean;
}

export interface CascaderPanelProps {
  modelValue: CascaderModelValue;
  options: CascaderOption[];
  props: CascaderFieldNames;
  multiple: boolean;
  checkable: boolean;
  checkStrictly: boolean;
  emitPath: boolean;
  showPrefix: boolean;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
}
