// elf-alert 类型

export type AlertType = "info" | "success" | "warning" | "danger";

export type AlertVariant = "light" | "filled" | "outlined";

export interface AlertProps {
  type: AlertType;
  variant: AlertVariant;
  title: string;
  description: string;
  closable: boolean;
  showIcon: boolean;
  /** 居中显示 */
  center: boolean;
}
