export type SliderSize = "sm" | "md" | "lg";
export type SliderModelValue = number | [number, number];

export interface SliderMark {
  value: number;
  label?: string;
}

export type SliderMarks = SliderMark[] | Record<string, string | number>;

export interface SliderProps {
  modelValue: SliderModelValue;
  min: number;
  max: number;
  step: number;
  range: boolean;
  disabled: boolean;
  readonly: boolean;
  vertical: boolean;
  showTooltip: boolean;
  showStops: boolean;
  segmented: boolean;
  showInput: boolean;
  marks: SliderMarks;
  color: string;
  size: SliderSize;
  formatTooltip?: (value: number) => string;
}
