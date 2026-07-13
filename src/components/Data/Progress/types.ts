export type ProgressVariant = "line" | "circle";
export type ProgressType = ProgressVariant | "dashboard";

export type ProgressStatus = "" | "primary" | "success" | "warning" | "danger" | "exception" | "info";

export interface ProgressProps {
  percentage?: number;
  type?: ProgressType;
  value: number;
  max: number;
  variant: ProgressVariant;
  status: ProgressStatus;
  color: string;
  trackColor: string;
  height: string;
  duration: number;
  width: number;
  size: number;
  strokeWidth: number;
  strokeLinecap: "butt" | "round" | "square";
  showText: boolean;
  textInside: boolean;
  striped: boolean;
  stripedFlow: boolean;
  indeterminate: boolean;
  format?: (percent: number, value: number) => string;
}
