// elf-grid + elf-grid-item 类型定义

export type GridGap = "0" | "xs" | "sm" | "md" | "lg" | "xl";

export interface GridProps {
  columns: number;
  gap: GridGap;
  autoFit: boolean;
  minColumnWidth: string;
}

export interface GridItemProps {
  span: number;
}
