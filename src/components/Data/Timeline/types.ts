export type TimelineColor = "primary" | "success" | "warning" | "danger" | "info";
export type TimelineMode = "left" | "right" | "alternate" | "horizontal";

export interface TimelineItem {
  timestamp?: string;
  title?: string;
  content?: string;
  icon?: string;
  color?: TimelineColor;
  [key: string]: unknown;
}

export interface TimelineProps {
  items: TimelineItem[];
  mode: TimelineMode;
  reverse: boolean;
}
