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
  bound?: number;
  bounds: number;
  duration: number;
  marker: boolean;
  type: "default" | "underline";
  direction: "vertical" | "horizontal";
  selectScrollTop: boolean;
  smooth: boolean;
  props: AnchorFieldNames;
}

export interface AnchorSlots {
  default?: unknown;
}

export interface AnchorLinkProps {
  title: string;
  href: string;
  /** Parent-managed active state. */
  active?: boolean;
  /** Parent-managed nesting level. */
  level?: number;
  /** Parent-managed layout direction. */
  direction?: "vertical" | "horizontal";
}

export interface AnchorLinkSlots {
  default?: unknown;
  "sub-link"?: unknown;
}

export interface AnchorElement {
  scrollTo: (href: string) => void;
  scrollToAnchor: (href: string) => void;
}
