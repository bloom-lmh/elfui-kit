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

export interface FlexProps {
  direction: FlexDirection;
  justify: FlexJustify;
  align: FlexAlign;
  gap: FlexGap;
  wrap: boolean;
  inline: boolean;
  fill: boolean;
}
