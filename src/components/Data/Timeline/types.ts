export type TimelineColor = "primary" | "success" | "warning" | "danger" | "info";
export type TimelineNodeSize = "normal" | "large";
/** Element Plus modes plus legacy Kit layout modes retained for compatibility. */
export type TimelineMode = "start" | "end" | "alternate" | "alternate-reverse" | "left" | "right" | "horizontal";

export interface TimelineItem {
  timestamp?: string;
  hideTimestamp?: boolean;
  center?: boolean;
  placement?: "top" | "bottom";
  type?: TimelineColor;
  title?: string;
  content?: string;
  icon?: string;
  color?: TimelineColor | string;
  size?: TimelineNodeSize;
  hollow?: boolean;
  [key: string]: unknown;
}

export interface TimelineProps {
  items: TimelineItem[];
  mode: TimelineMode;
  reverse: boolean;
}
