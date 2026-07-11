export type DescriptionsDirection = "horizontal" | "vertical";
export type DescriptionsSize = "sm" | "md" | "lg" | "";

export interface DescriptionItem {
  label?: string;
  value?: string | number;
  span?: number;
}

export interface DescriptionsFieldNames {
  label?: string;
  value?: string;
  span?: string;
}

export interface DescriptionsProps {
  title: string;
  extra: string;
  items: DescriptionItem[];
  column: number;
  border: boolean;
  direction: DescriptionsDirection;
  size: DescriptionsSize;
  props: DescriptionsFieldNames;
}
