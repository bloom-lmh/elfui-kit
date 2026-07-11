// Notification 类型定义

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface NotificationOptions {
  title?: string;
  message: string;
  type?: NotificationType;
  position?: NotificationPosition;
  duration?: number;
  closable?: boolean;
  offset?: number;
  onClick?: () => void;
}

export interface NotificationHandle {
  close(): void;
}
