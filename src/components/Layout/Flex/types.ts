// elf-flex 类型定义

/** Flex 主轴方向 */
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

/** Flex 主轴对齐 */
export type FlexJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

/** Flex 交叉轴对齐 */
export type FlexAlign = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

/** Flex 间距尺寸 */
export type FlexGap = "0" | "xs" | "sm" | "md" | "lg" | "xl";

/** 预设间距、任意 CSS 长度、像素值，或 [水平, 垂直] 像素元组。 */
export type FlexSize = FlexGap | string | number | [number, number];

export interface FlexProps {
  direction: FlexDirection;
  justify: FlexJustify;
  align: FlexAlign;
  /** Element Plus Space compatibility alias for align. */
  alignment: FlexAlign | "";
  gap: FlexSize;
  /** Element Plus Space compatibility alias for gap. */
  size: FlexSize | "";
  wrap: boolean;
  inline: boolean;
  fill: boolean;
  fillRatio: number;
}

export interface FlexSlots {
  default?: unknown;
}
