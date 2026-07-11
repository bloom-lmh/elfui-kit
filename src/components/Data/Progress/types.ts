export type ProgressVariant = "line" | "circle";

export type ProgressStatus = "" | "primary" | "success" | "warning" | "danger" | "info";

export interface ProgressProps {
  value: number;
  max: number;
  variant: ProgressVariant;
  status: ProgressStatus;
  color: string;
  trackColor: string;
  height: string;
  size: number;
  strokeWidth: number;
  showText: boolean;
  textInside: boolean;
  striped: boolean;
  indeterminate: boolean;
  format?: (percent: number, value: number) => string;
}
