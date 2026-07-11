// elf-tour 类型定义

export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: TourPlacement;
  nextText?: string;
  prevText?: string;
}

export interface TourProps {
  steps: TourStep[];
  visible: boolean;
  current: number;
  maskClosable: boolean;
  keyboard: boolean;
  lockScroll: boolean;
  gap: number;
  zIndex: number;
}

export interface TourChangeDetail {
  current: number;
  step: TourStep | null;
}
