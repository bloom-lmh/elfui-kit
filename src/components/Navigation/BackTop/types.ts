export type BackTopShape = "circle" | "square";

export interface BackTopClickDetail {
  scrollTop: number;
  event: Event;
}

export interface BackTopProps {
  target: string | HTMLElement | Window | (() => HTMLElement | Window | null) | null;
  visibilityHeight: number;
  right: string | number;
  bottom: string | number;
  zIndex: string | number;
  smooth: boolean;
  shape: BackTopShape;
  size: string | number;
  icon: string;
  disabled: boolean;
}

export interface BackTopElement {
  scrollToTop: () => void;
}
