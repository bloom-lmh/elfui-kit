// elf-divider 类型

export type DividerDirection = "horizontal" | "vertical";

export type DividerContentPosition = "left" | "center" | "right";

/** CSS border styles documented by Element Plus. */
export type DividerBorderStyle = "solid" | "dashed" | "dotted" | "double";

export interface DividerProps {
  direction: DividerDirection;
  contentPosition: DividerContentPosition;
  borderStyle: DividerBorderStyle;
  /** @deprecated Prefer `borderStyle="dashed"`. */
  dashed: boolean;
}
