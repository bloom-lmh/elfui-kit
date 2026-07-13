export type SliderSize = "sm" | "md" | "lg";
export type SliderInputSize = SliderSize | "small" | "default" | "large";
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
  showInputControls: boolean;
  inputSize: SliderInputSize;
  marks: SliderMarks;
  color: string;
  size: SliderSize;
  formatTooltip?: (value: number) => string;
  formatValueText?: (value: number) => string;
  height: string | number;
  ariaLabel: string;
  rangeStartLabel: string;
  rangeEndLabel: string;
  tooltipClass: string;
  placement: "top" | "bottom" | "left" | "right";
  persistent: boolean;
  label: string;
  validateEvent: boolean;
}
