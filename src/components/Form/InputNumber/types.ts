export type InputNumberSize = "sm" | "md" | "lg" | "";
export type InputNumberControlsPosition = "" | "right";

export interface InputNumberProps {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step: number;
  stepStrictly: boolean;
  precision?: number;
  disabled: boolean;
  readonly: boolean;
  controls: boolean;
  controlsPosition: InputNumberControlsPosition;
  size: InputNumberSize;
  placeholder: string;
  name: string;
  valueOnClear: number | null;
  validateEvent: boolean;
}
