// elf-divider 类型

export type DividerDirection = "horizontal" | "vertical";

export type DividerContentPosition = "left" | "center" | "right";

export interface DividerProps {
  direction: DividerDirection;
  contentPosition: DividerContentPosition;
  dashed: boolean;
}
