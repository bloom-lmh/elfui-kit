export type TabsAlign = "start" | "center" | "end" | "title";
export type TabsDensity = "compact" | "default" | "comfortable";
export type TabsDirection = "horizontal" | "vertical";
export type TabsType = "line" | "card" | "border-card";
export type TabsPosition = "top" | "right" | "bottom" | "left";
export type TabsTransition = "fade" | "slide" | "scale" | "none" | "custom";
export type TabsBeforeLeave = (
  newName: string,
  oldName: string
) => boolean | void | Promise<boolean | void>;

export interface TabsFieldNames {
  label?: string;
  value?: string;
  icon?: string;
  disabled?: string;
  closable?: string;
  lazy?: string;
  badge?: string;
  content?: string;
}

export interface TabsItem {
  label?: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
  badge?: string | number;
  content?: string;
  [key: string]: unknown;
}

export interface TabsProps {
  items: TabsItem[];
  modelValue: string;
  defaultValue: string;
  alignTabs: TabsAlign;
  density: TabsDensity;
  direction: TabsDirection;
  type: TabsType;
  closable: boolean;
  addable: boolean;
  editable: boolean;
  tabPosition: TabsPosition;
  stretch: boolean;
  beforeLeave?: TabsBeforeLeave;
  tabindex: number;
  color: string;
  grow: boolean;
  stacked: boolean;
  showPanels: boolean;
  hideSlider: boolean;
  transition: TabsTransition;
  transitionDuration: number;
  props: TabsFieldNames;
}
