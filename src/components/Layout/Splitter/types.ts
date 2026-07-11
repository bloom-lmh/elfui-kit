export interface SplitterProps {
  modelValue: number;
  min: number;
  max: number;
  vertical: boolean;
  disabled: boolean;
}

export interface SplitterSlots {
  first?: unknown;
  second?: unknown;
}
