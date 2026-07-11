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
}

export interface WatermarkSlots {
  default?: unknown;
}
