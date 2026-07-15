export interface IconProps {
  name: string;
  size: number | string;
  color: string;
  ariaLabel: string;
  loading: boolean;
}

export interface IconSlots {
  default?: unknown;
}
