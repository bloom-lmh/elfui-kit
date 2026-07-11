// elf-steps 类型定义

export type StepStatus = "wait" | "process" | "finish" | "error";
export type StepsDirection = "horizontal" | "vertical";
export type StepsSize = "sm" | "md" | "lg";

export interface StepItem {
  title: string;
  description?: string;
  icon?: string;
  status?: StepStatus;
  disabled?: boolean;
  value?: string | number;
}

export interface StepsProps {
  active: number;
  direction: StepsDirection;
  items: StepItem[];
  space?: string | number;
  processStatus: StepStatus;
  finishStatus: StepStatus;
  alignCenter: boolean;
  simple: boolean;
  size: StepsSize;
  clickable: boolean;
  alternativeLabel: boolean;
}

export interface StepsChangeDetail {
  active: number;
  item: StepItem;
}
