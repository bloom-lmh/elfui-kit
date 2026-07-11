// elf-skeleton 类型定义

export type SkeletonVariant = "text" | "circle" | "rect" | "image";

export interface SkeletonProps {
  /** 形状变体 */
  variant: SkeletonVariant;
  /** 宽度 */
  width: string;
  /** 高度 */
  height: string;
  /** shimmer 扫光动画 */
  animated: boolean;
  /** 重复条数 */
  count: number;
  /** 行间距 */
  gap: string;
}
