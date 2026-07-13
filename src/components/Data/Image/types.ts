export type ImageFit = "fill" | "contain" | "cover" | "none" | "scale-down";

export interface ImageProps {
  src: string;
  alt: string;
  fit: ImageFit;
  width: number | string;
  height: number | string;
  lazy: boolean;
  previewSrcList: string[];
  initialIndex: number;
  previewTeleported: boolean;
  zoomRate: number;
  toolbar: boolean;
}
