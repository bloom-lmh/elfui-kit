export interface WatermarkFont {
  fontSize?: number;
  color?: string;
}

export interface WatermarkProps {
  content: string | string[];
  image: string;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  gapX: number;
  gapY: number;
  offsetX?: number;
  offsetY?: number;
  fontSize: number;
  fontColor: string;
  font: WatermarkFont;
}

export interface WatermarkSlots {
  default?: unknown;
}
