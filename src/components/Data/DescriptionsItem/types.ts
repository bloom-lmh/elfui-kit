export type DescriptionsItemAlign = "left" | "center" | "right" | "";

export interface DescriptionsItemProps {
  label: string;
  span: number;
  align: DescriptionsItemAlign;
  labelAlign: DescriptionsItemAlign;
  labelWidth: string | number;
  className: string;
}

export interface DescriptionsItemSlots {
  default: unknown;
  label: unknown;
}
