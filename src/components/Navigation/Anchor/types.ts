export interface AnchorFieldNames {
  title?: string;
  href?: string;
  disabled?: string;
  children?: string;
}

export interface AnchorItem {
  title?: string;
  href?: string;
  disabled?: boolean;
  children?: AnchorItem[];
  [key: string]: unknown;
}

export interface AnchorClickDetail {
  href: string;
  item: AnchorItem;
  event: Event;
}

export interface AnchorChangeDetail {
  href: string;
  oldHref: string;
}

export interface AnchorProps {
  items: AnchorItem[];
  modelValue: string;
  defaultActive: string;
  container: string | HTMLElement | Window | (() => HTMLElement | Window | null) | null;
  offset: number;
  bound: number;
  bounds: number;
  duration: number;
  marker: boolean;
  type: "default" | "underline";
  direction: "vertical" | "horizontal";
  selectScrollTop: boolean;
  smooth: boolean;
  props: AnchorFieldNames;
}

export interface AnchorElement {
  scrollTo: (href: string) => void;
  scrollToAnchor: (href: string) => void;
}
