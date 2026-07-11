export type CollapseModelValue = string | string[];

export interface CollapseItem {
  name?: string;
  title?: string;
  content?: string;
  disabled?: boolean;
}

export interface CollapseFieldNames {
  name?: string;
  title?: string;
  content?: string;
  disabled?: string;
}

export interface CollapseProps {
  modelValue?: CollapseModelValue;
  accordion: boolean;
  items: CollapseItem[];
  props: CollapseFieldNames;
}
