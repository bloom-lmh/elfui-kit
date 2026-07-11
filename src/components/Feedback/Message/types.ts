// Message 类型

export type MessageType = "info" | "success" | "warning" | "danger" | "error";
export type MessagePosition = "top" | "bottom";

export interface MessageOptions {
  message: string;
  type?: MessageType;
  /** 持续显示毫秒数，0 = 不自动关闭 */
  duration?: number;
  /** 显示关闭按钮 */
  closable?: boolean;
  /** 距离视口边缘偏移 */
  offset?: number;
  /** 显示位置 */
  position?: MessagePosition;
  /** 自定义层级 */
  zIndex?: number;
  /** 自定义宿主 class */
  customClass?: string;
  /** 点击消息时触发 */
  onClick?: () => void;
  /** 消息关闭并移除后触发 */
  onClose?: () => void;
}

export interface MessageHandle {
  close(): void;
}
