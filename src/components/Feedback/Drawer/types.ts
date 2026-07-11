// elf-drawer 类型定义

export type DrawerDirection = "rtl" | "ltr" | "ttb" | "btt";

export interface DrawerProps {
  /** v-model:open — 是否打开 */
  open?: boolean;
  /** 标题 */
  title?: string;
  /** 弹出方向，默认 rtl */
  direction?: DrawerDirection;
  /** 抽屉大小，水平方向为宽，垂直方向为高，如 "30%" 或 "300px" */
  size?: string;
  /** 是否显示半透明遮罩 */
  modal?: boolean;
  /** 点击遮罩是否关闭 */
  closeOnMask?: boolean;
  /** ESC 是否关闭 */
  closeOnEscape?: boolean;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean;
  /** 关闭前钩子，返回 false 阻止关闭 */
  beforeClose?: () => boolean | Promise<boolean>;
}
